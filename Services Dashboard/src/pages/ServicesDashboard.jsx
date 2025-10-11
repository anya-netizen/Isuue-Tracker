import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FileWarning,
  FileX,
  Landmark,
  DollarSign,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  Target
} from "lucide-react";
import { physicianGroups, patients, documents, careCoordination } from "@/data/mockData";
import { enhancedPhysicianGroups } from "@/data/enhancedPGData";
import { COMPLETE_US_COUNTIES } from "@/data/complete-counties";
import { STATE_CENTROIDS } from "@/data/stateCentroids";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
    iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
    shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString()
  });
}

const COLOR_MAP = {
  good: "#10B981",
  "needs-attention": "#F59E0B",
  critical: "#EF4444"
};

const ATTENTION_LABELS = {
  good: "Stable",
  "needs-attention": "Needs Attention",
  critical: "Critical Hotspot"
};

const CARD_CONFIG = [
  {
    key: "docsUnprepared",
    title: "Docs Unprepared Status",
    description: "Physician groups with documentation still in draft",
    icon: FileWarning,
    accent: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-800"
  },
  {
    key: "documentsNotPresent",
    title: "Documents Not Present",
    description: "Missing F2F / 485 certifications for active episodes",
    icon: FileX,
    accent: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-800"
  },
  {
    key: "billingPending",
    title: "Billing Pending",
    description: "PGs with outstanding billing reviews",
    icon: DollarSign,
    accent: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800"
  },
  {
    key: "claimsPending",
    title: "Claims Pending",
    description: "Claims awaiting submission or validation",
    icon: Landmark,
    accent: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-800"
  },
  {
    key: "cpoCapturePending",
    title: "CPO Capture Pending",
    description: "Care coordination minutes below monthly target",
    icon: Activity,
    accent: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800"
  }
];

const DEFAULT_MAP_CENTER = [39.8283, -98.5795];
const DEFAULT_MAP_ZOOM = 4;

const GSA_COORDINATE_LOOKUP = {
  "gsa-1": { center: [44, -70], zoom: 5.5 },
  "gsa-2": { center: [42.5, -75], zoom: 5.7 },
  "gsa-3": { center: [39.5, -79], zoom: 5.7 },
  "gsa-4": { center: [30.5, -81], zoom: 5.4 },
  "gsa-5": { center: [43.5, -86.5], zoom: 5.4 },
  "gsa-6": { center: [31, -98], zoom: 5.2 },
  "gsa-7": { center: [40, -96.5], zoom: 5.8 },
  "gsa-8": { center: [43, -105], zoom: 5.2 },
  "gsa-9": { center: [37, -117], zoom: 5.2 },
  "gsa-10": { center: [45.5, -117.5], zoom: 5.3 }
};

const MSA_COORDINATE_LOOKUP = {
  "msa-boston": { center: [42.4, -71], zoom: 9 },
  "msa-nyc": { center: [40.7, -74.1], zoom: 9 },
  "msa-philadelphia": { center: [40, -75.15], zoom: 9 },
  "msa-atlanta": { center: [33.7, -84.4], zoom: 9 },
  "msa-chicago": { center: [41.95, -87.85], zoom: 9 },
  "msa-dallas": { center: [32.85, -97], zoom: 9 },
  "msa-houston": { center: [29.8, -95.3], zoom: 9 },
  "msa-phoenix": { center: [33.4, -112], zoom: 9 },
  "msa-los-angeles": { center: [34, -117.9], zoom: 9 },
  "msa-san-francisco": { center: [37.7, -122.3], zoom: 9 },
  "msa-seattle": { center: [47.45, -122], zoom: 9 }
};

const LEVEL_DEFAULT_ZOOM = {
  gsa: 5,
  msa: 7,
  division: 6,
  county: 7.5,
  pg: 9
};

const REQUIRED_DOC_TYPES = ["f2f", "485"];
const CLAIM_CODES = new Set(["G0180", "G0181", "99490", "99491"]);

const GSA_REGIONS = {
  "gsa-1": "GSA Region 1 - New England",
  "gsa-2": "GSA Region 2 - Northeast & Caribbean",
  "gsa-3": "GSA Region 3 - Mid-Atlantic",
  "gsa-4": "GSA Region 4 - Southeast",
  "gsa-5": "GSA Region 5 - Great Lakes",
  "gsa-6": "GSA Region 6 - South Central",
  "gsa-7": "GSA Region 7 - Great Plains",
  "gsa-8": "GSA Region 8 - Rocky Mountain",
  "gsa-9": "GSA Region 9 - Pacific",
  "gsa-10": "GSA Region 10 - Northwest"
};

const MSA_REGIONS = {
  "msa-boston": "Boston-Cambridge-Newton MSA",
  "msa-nyc": "New York-Newark-Jersey City MSA",
  "msa-philadelphia": "Philadelphia-Camden-Wilmington MSA",
  "msa-atlanta": "Atlanta-Sandy Springs-Alpharetta MSA",
  "msa-chicago": "Chicago-Naperville-Elgin MSA",
  "msa-dallas": "Dallas-Fort Worth-Arlington MSA",
  "msa-houston": "Houston-The Woodlands-Sugar Land MSA",
  "msa-phoenix": "Phoenix-Mesa-Chandler MSA",
  "msa-los-angeles": "Los Angeles-Long Beach-Anaheim MSA",
  "msa-san-francisco": "San Francisco-Oakland-Berkeley MSA",
  "msa-seattle": "Seattle-Tacoma-Bellevue MSA"
};

const STATE_ABBREVIATIONS = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY"
};

const STATE_NAME_BY_ABBR = Object.entries(STATE_ABBREVIATIONS).reduce(
  (acc, [name, abbr]) => {
    acc[abbr] = name;
    return acc;
  },
  {}
);

const LEVEL_OPTIONS = [
  { value: "gsa", label: "GSA" },
  { value: "msa", label: "MSA" },
  { value: "division", label: "Division" },
  { value: "county", label: "County" }
];

const determineAttention = (issues, population) => {
  if (!issues) {
    return "good";
  }
  const threshold = Math.max(1, Math.round((population || 1) * 0.3));
  if (issues <= threshold) {
    return "needs-attention";
  }
  return "critical";
};

const formatLabel = (value = "") =>
  value
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());

const normalizeState = (stateValue) => {
  if (!stateValue) return undefined;
  const trimmed = stateValue.trim();
  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }
  return STATE_ABBREVIATIONS[trimmed] || trimmed.slice(0, 2).toUpperCase();
};

const buildAddressString = (pg) => {
  if (typeof pg.address === "string") {
    return pg.address;
  }
  if (pg.address && pg.address.street) {
    return pg.address.street;
  }
  return "";
};

const assignGeography = (pg) => {
  let gsa = "gsa-1";
  let msa = "msa-boston";
  let county = pg.county || "Suffolk";
  const city = pg.city || pg.address?.city || "Boston";
  const state = pg.state || pg.address?.state || "MA";

  const normalizedState = normalizeState(state);
  const normalizedCity = city ? city.trim() : "";

  if (["CT", "MA", "ME", "NH", "RI", "VT"].includes(normalizedState)) {
    gsa = "gsa-1";
    if (["Boston", "Cambridge", "Newton", "Quincy", "Somerville"].includes(normalizedCity)) {
      msa = "msa-boston";
      county = normalizedCity === "Boston" ? "Suffolk" : "Middlesex";
    }
  } else if (["NJ", "NY", "PR", "VI"].includes(normalizedState)) {
    gsa = "gsa-2";
    if (["New York", "Brooklyn", "Queens", "Bronx", "Manhattan"].includes(normalizedCity)) {
      msa = "msa-nyc";
      county = normalizedCity === "Manhattan" ? "New York" : "Kings";
    }
  } else if (["DE", "DC", "MD", "PA", "VA", "WV"].includes(normalizedState)) {
    gsa = "gsa-3";
    if (["Philadelphia", "Camden", "Wilmington"].includes(normalizedCity)) {
      msa = "msa-philadelphia";
      county = "Philadelphia";
    }
  } else if (["AL", "FL", "GA", "KY", "MS", "NC", "SC", "TN"].includes(normalizedState)) {
    gsa = "gsa-4";
    if (["Atlanta", "Sandy Springs", "Alpharetta"].includes(normalizedCity)) {
      msa = "msa-atlanta";
      county = "Fulton";
    }
  } else if (["IL", "IN", "MI", "MN", "OH", "WI"].includes(normalizedState)) {
    gsa = "gsa-5";
    if (["Chicago", "Naperville", "Elgin"].includes(normalizedCity)) {
      msa = "msa-chicago";
      county = "Cook";
    }
  } else if (["AR", "LA", "NM", "OK", "TX"].includes(normalizedState)) {
    gsa = "gsa-6";
    if (["Dallas", "Fort Worth", "Arlington"].includes(normalizedCity)) {
      msa = "msa-dallas";
      county = "Dallas";
    } else if (["Houston", "The Woodlands", "Sugar Land"].includes(normalizedCity)) {
      msa = "msa-houston";
      county = "Harris";
    }
  } else if (["IA", "KS", "MO", "NE"].includes(normalizedState)) {
    gsa = "gsa-7";
  } else if (["CO", "MT", "ND", "SD", "UT", "WY"].includes(normalizedState)) {
    gsa = "gsa-8";
  } else if (["AZ", "CA", "HI", "NV"].includes(normalizedState)) {
    gsa = "gsa-9";
    if (["Phoenix", "Mesa", "Chandler"].includes(normalizedCity)) {
      msa = "msa-phoenix";
      county = "Maricopa";
    } else if (["Los Angeles", "Long Beach", "Anaheim"].includes(normalizedCity)) {
      msa = "msa-los-angeles";
      county = "Los Angeles";
    } else if (["San Francisco", "Oakland", "Berkeley"].includes(normalizedCity)) {
      msa = "msa-san-francisco";
      county = "San Francisco";
    }
  } else if (["AK", "ID", "OR", "WA"].includes(normalizedState)) {
    gsa = "gsa-10";
    if (["Seattle", "Tacoma", "Bellevue"].includes(normalizedCity)) {
      msa = "msa-seattle";
      county = "King";
    }
  }

  const division = pg.activePatients > 100
    ? "Major Healthcare Division"
    : pg.activePatients > 50
      ? "Regional Healthcare Division"
      : "Local Healthcare Division";

  return {
    ...pg,
    city: normalizedCity,
    state: normalizedState,
    gsa,
    msa,
    county,
    division
  };
};

const uniquePhysicianGroups = () => {
  const map = new Map();
  [...physicianGroups, ...enhancedPhysicianGroups].forEach((pg, index) => {
    if (!pg) return;
    const key = pg.id || pg.npi || pg.name || `pg-${index}`;
    if (!map.has(key)) {
      const address = buildAddressString(pg);
      map.set(key, {
        ...pg,
        id: pg.id || key,
        name: pg.name || `Physician Group ${index + 1}`,
        address,
        city: pg.city || pg.address?.city || "Boston",
        state: normalizeState(pg.state || pg.address?.state || "MA"),
        zip: pg.zip || pg.address?.zip || "",
        activePatients: pg.activePatients ?? 0
      });
    }
  });
  return Array.from(map.values());
};

const buildDocumentsMap = () => {
  const map = new Map();
  documents.forEach((doc) => {
    const key = doc.patient_id || doc.patientId;
    if (!key) return;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(doc);
  });
  return map;
};

const buildCareCoordinationMap = () => {
  const map = new Map();
  careCoordination.forEach((entry) => {
    if (!entry.patientId) return;
    map.set(entry.patientId, entry);
  });
  return map;
};

const ServicesDashboard = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("gsa");
  const [selectedKey, setSelectedKey] = useState(null);
  const [dialogState, setDialogState] = useState({ open: false, cardKey: null });

  const normalizedPGs = useMemo(() => uniquePhysicianGroups().map(assignGeography), []);

  const countyCoordinateLookup = useMemo(() => {
    const map = new Map();
    COMPLETE_US_COUNTIES.forEach(({ name, state, coordinates }) => {
      if (!coordinates || coordinates.length < 2) return;
      const stateAbbr = (STATE_ABBREVIATIONS[state] || state || "").toString();
      if (!stateAbbr) return;
      const latLng = [coordinates[1], coordinates[0]];
      const normalizedName = name.toLowerCase();
      const trimmedName = normalizedName
        .replace(/ county| parish| borough| census area| municipality| city/gi, "")
        .trim();
      const lowerStateAbbr = stateAbbr.toLowerCase();
      const lowerStateName = state.toLowerCase();

      map.set(`${normalizedName}-${lowerStateAbbr}`, latLng);
      map.set(`${trimmedName}-${lowerStateAbbr}`, latLng);
      map.set(`${normalizedName}-${lowerStateName}`, latLng);
      map.set(`${trimmedName}-${lowerStateName}`, latLng);
    });
    return map;
  }, []);

  const getCountyCoordinate = useCallback(
    (countyName, stateAbbr) => {
      if (!countyName || !stateAbbr) return null;
      const normalizedName = countyName.toLowerCase();
      const trimmedName = normalizedName.replace(/ county$/i, "").trim();
      const candidates = [];
      const upperState = stateAbbr.toUpperCase();
      const lowerState = upperState.toLowerCase();
      candidates.push(`${normalizedName}-${lowerState}`);
      candidates.push(`${trimmedName}-${lowerState}`);

      const stateFull = STATE_NAME_BY_ABBR[upperState];
      if (stateFull) {
        const lowerFull = stateFull.toLowerCase();
        candidates.push(`${normalizedName}-${lowerFull}`);
        candidates.push(`${trimmedName}-${lowerFull}`);
      }

      for (const key of candidates) {
        if (countyCoordinateLookup.has(key)) {
          return countyCoordinateLookup.get(key);
        }
      }
      return null;
    },
    [countyCoordinateLookup]
  );

  const documentsByPatientId = useMemo(() => buildDocumentsMap(), []);
  const careCoordByPatientId = useMemo(() => buildCareCoordinationMap(), []);

  const patientsByPgId = useMemo(() => {
    const byId = new Map();
    patients.forEach((patient) => {
      if (patient.physicianGroupId) {
        if (!byId.has(patient.physicianGroupId)) {
          byId.set(patient.physicianGroupId, []);
        }
        byId.get(patient.physicianGroupId).push(patient);
      }
    });
    return byId;
  }, []);

  const patientsByPgName = useMemo(() => {
    const byName = new Map();
    patients.forEach((patient) => {
      if (patient.current_pg) {
        if (!byName.has(patient.current_pg)) {
          byName.set(patient.current_pg, []);
        }
        byName.get(patient.current_pg).push(patient);
      }
    });
    return byName;
  }, []);

  const getPatientsForPg = useCallback(
    (pg) => {
      const map = new Map();
      const candidates = [
        ...(pg.id && patientsByPgId.get(pg.id) ? patientsByPgId.get(pg.id) : []),
        ...(patientsByPgName.get(pg.name) || [])
      ];
      candidates.forEach((patient) => {
        const key = patient.id || patient.patient_id;
        if (!key) return;
        if (!map.has(key)) {
          map.set(key, patient);
        }
      });
      return Array.from(map.values());
    },
    [patientsByPgId, patientsByPgName]
  );

  const pgMetrics = useMemo(() => {
    const metricsMap = new Map();

    normalizedPGs.forEach((pg) => {
      const pgPatients = getPatientsForPg(pg);
      const metrics = {
        docsUnprepared: 0,
        documentsNotPresent: 0,
        billingPending: 0,
        claimsPending: 0,
        cpoCapturePending: 0
      };

      pgPatients.forEach((patient) => {
        const patientId = patient.id || patient.patient_id;
        const patientDocs = documentsByPatientId.get(patientId) || [];
        const docTypes = new Set(
          patientDocs
            .filter((doc) => doc.status === "completed")
            .map((doc) => doc.document_type)
        );

        const missingDocs = REQUIRED_DOC_TYPES.reduce(
          (count, type) => (docTypes.has(type) ? count : count + 1),
          0
        );

        if (patient.billability_status && patient.billability_status !== "billable") {
          metrics.docsUnprepared += 1;
        }

        if (missingDocs > 0) {
          metrics.documentsNotPresent += missingDocs;
        }

        if (patient.billability_status === "pending_review") {
          metrics.billingPending += 1;
          if (patient.cpt_code && CLAIM_CODES.has(patient.cpt_code)) {
            metrics.claimsPending += 1;
          }
        }

        const careEntry =
          careCoordByPatientId.get(patientId) || careCoordByPatientId.get(patient.patient_id);
        if (!careEntry || careEntry.cpoMinutes < 60) {
          metrics.cpoCapturePending += 1;
        }
      });

      const totalPatients = pgPatients.length || pg.activePatients || 0;
      const totalIssues = Object.values(metrics).reduce((sum, value) => sum + value, 0);
      const attentionLevel = determineAttention(totalIssues, totalPatients || pgPatients.length || 1);

      metricsMap.set(pg.id, {
        pg,
        metrics,
        totalPatients,
        totalIssues,
        attentionLevel,
        color: COLOR_MAP[attentionLevel]
      });
    });

    return metricsMap;
  }, [normalizedPGs, getPatientsForPg, documentsByPatientId, careCoordByPatientId]);

  const getPgCoordinate = useCallback(
    (pg) => {
      if (!pg) return null;
      if (typeof pg.lat === "number" && typeof pg.lng === "number") {
        return [pg.lat, pg.lng];
      }
      if (typeof pg.latitude === "number" && typeof pg.longitude === "number") {
        return [pg.latitude, pg.longitude];
      }
      const countyCoord = getCountyCoordinate(pg.county, pg.state);
      if (countyCoord) {
        return countyCoord;
      }
      const stateCentroid = STATE_CENTROIDS[(pg.state || "").toUpperCase()];
      if (stateCentroid) {
        return [stateCentroid.lat, stateCentroid.lng];
      }
      return null;
    },
    [getCountyCoordinate]
  );

  const getUnitCenter = useCallback(
    (level, node) => {
      if (!node) return null;
      if (level === "gsa" && GSA_COORDINATE_LOOKUP[node.key]) {
        return GSA_COORDINATE_LOOKUP[node.key].center;
      }
      if (level === "msa" && MSA_COORDINATE_LOOKUP[node.key]) {
        return MSA_COORDINATE_LOOKUP[node.key].center;
      }
      const pgIds = node.pgs || [];
      const coords = pgIds
        .map((pgId) => {
          const metric = pgMetrics.get(pgId);
          if (!metric) return null;
          return getPgCoordinate(metric.pg);
        })
        .filter(Boolean);
      if (!coords.length) return null;
      const avgLat = coords.reduce((sum, [lat]) => sum + lat, 0) / coords.length;
      const avgLng = coords.reduce((sum, [, lng]) => sum + lng, 0) / coords.length;
      return [avgLat, avgLng];
    },
    [getPgCoordinate, pgMetrics]
  );

  const getUnitLabel = useCallback(
    (level, key) => {
      if (!key) return "Unassigned";
      switch (level) {
        case "gsa":
          return GSA_REGIONS[key] || formatLabel(key);
        case "msa":
          return MSA_REGIONS[key] || formatLabel(key);
        case "division":
          return formatLabel(key);
        case "county": {
          const samplePg = normalizedPGs.find((pg) => pg.county === key);
          const state = samplePg?.state ? `, ${samplePg.state}` : "";
          return `${formatLabel(key)} County${state}`;
        }
        default:
          return formatLabel(key);
      }
    },
    [normalizedPGs]
  );

  const computeUnitStats = useCallback(
    (level, key) => {
      if (!key) return null;
      const relevantPGs = normalizedPGs.filter((pg) => {
        if (level === "gsa") return pg.gsa === key;
        if (level === "msa") return pg.msa === key;
        if (level === "division") return pg.division === key;
        if (level === "county") return pg.county === key;
        return false;
      });

      if (!relevantPGs.length) {
        return null;
      }

      const result = {
        unitName: getUnitLabel(level, key),
        totalPGs: relevantPGs.length,
        totalPatients: 0,
        attentionLevel: "good",
        color: COLOR_MAP.good,
        cards: {}
      };

      CARD_CONFIG.forEach((card) => {
        result.cards[card.key] = {
          total: 0,
          breakdown: []
        };
      });

      let totalIssues = 0;

      relevantPGs.forEach((pg) => {
        const metric = pgMetrics.get(pg.id);
        if (!metric) return;
        result.totalPatients += metric.totalPatients || pg.activePatients || 0;
        totalIssues += metric.totalIssues;

        CARD_CONFIG.forEach((card) => {
          const value = metric.metrics[card.key] || 0;
          result.cards[card.key].total += value;
          if (value > 0) {
            result.cards[card.key].breakdown.push({
              pgId: pg.id,
              pgName: metric.pg.name,
              count: value,
              attentionLevel: metric.attentionLevel,
              color: metric.color
            });
          }
        });
      });

      CARD_CONFIG.forEach((card) => {
        result.cards[card.key].breakdown.sort((a, b) => b.count - a.count);
      });

      const attentionLevel = determineAttention(totalIssues, result.totalPatients || relevantPGs.length);
      result.attentionLevel = attentionLevel;
      result.color = COLOR_MAP[attentionLevel];

      return result;
    },
    [normalizedPGs, pgMetrics, getUnitLabel]
  );

  const levelSummaries = useMemo(() => {
    const base = {
      gsa: new Map(),
      msa: new Map(),
      division: new Map(),
      county: new Map()
    };

    normalizedPGs.forEach((pg) => {
      const metric = pgMetrics.get(pg.id);
      if (!metric) return;

      [
        ["gsa", pg.gsa],
        ["msa", pg.msa],
        ["division", pg.division],
        ["county", pg.county]
      ].forEach(([level, key]) => {
        if (!key) return;
        const store = base[level];
        if (!store.has(key)) {
          store.set(key, {
            key,
            label: getUnitLabel(level, key),
            totalPatients: 0,
            totalIssues: 0,
            pgs: new Set()
          });
        }
        const entry = store.get(key);
        entry.totalPatients += metric.totalPatients || pg.activePatients || 0;
        entry.totalIssues += metric.totalIssues;
        entry.pgs.add(pg.id);
      });
    });

    const convert = (map) =>
      Array.from(map.values()).map((entry) => {
        const attentionLevel = determineAttention(
          entry.totalIssues,
          entry.totalPatients || entry.pgs.size
        );
        return {
          ...entry,
          pgs: Array.from(entry.pgs),
          attentionLevel,
          color: COLOR_MAP[attentionLevel]
        };
      });

    return {
      gsa: convert(base.gsa).sort((a, b) => b.totalIssues - a.totalIssues),
      msa: convert(base.msa).sort((a, b) => b.totalIssues - a.totalIssues),
      division: convert(base.division).sort((a, b) => b.totalIssues - a.totalIssues),
      county: convert(base.county).sort((a, b) => b.totalIssues - a.totalIssues)
    };
  }, [normalizedPGs, pgMetrics, getUnitLabel]);

  useEffect(() => {
    const options = levelSummaries[selectedLevel] || [];
    if (!options.length) {
      setSelectedKey(null);
      return;
    }
    if (!options.some((option) => option.key === selectedKey)) {
      setSelectedKey(options[0].key);
    }
  }, [selectedLevel, levelSummaries, selectedKey]);

  const getPGNodesForUnit = useCallback(
    (pgIds = []) =>
      pgIds
        .map((pgId) => {
          const metric = pgMetrics.get(pgId);
          if (!metric) return null;
          return {
            id: pgId,
            name: metric.pg.name,
            key: pgId,
            level: "pg",
            value: Math.max(metric.totalPatients || 1, 1),
            attentionLevel: metric.attentionLevel,
            fill: metric.color,
            color: metric.color,
            metrics: {
              ...metric.metrics,
              totalPatients: metric.totalPatients,
              totalIssues: metric.totalIssues
            }
          };
        })
        .filter(Boolean),
    [pgMetrics]
  );

  const hierarchyData = useMemo(() => {
    const root = {
      id: "root",
      name: "Services Health",
      key: "root",
      level: "root",
      value: 0,
      fill: "#312E81",
      color: "#312E81",
      children: []
    };

    const options = levelSummaries[selectedLevel] || [];
    options.forEach((option) => {
      const unitMetrics = computeUnitStats(selectedLevel, option.key);
      const node = {
        id: option.key,
        name: option.label,
        key: option.key,
        level: selectedLevel,
        value: Math.max(unitMetrics?.totalPatients || option.totalPatients || option.pgs.length || 1, 1),
        attentionLevel: unitMetrics?.attentionLevel || option.attentionLevel,
        fill: COLOR_MAP[unitMetrics?.attentionLevel || option.attentionLevel],
        color: COLOR_MAP[unitMetrics?.attentionLevel || option.attentionLevel],
        metrics: unitMetrics,
        children: [],
        pgs: option.pgs
      };

      if (selectedLevel === "gsa") {
        const msaGroups = new Map();
        option.pgs.forEach((pgId) => {
          const pg = pgMetrics.get(pgId)?.pg;
          if (!pg?.msa) return;
          if (!msaGroups.has(pg.msa)) {
            msaGroups.set(pg.msa, new Set());
          }
          msaGroups.get(pg.msa).add(pgId);
        });
        node.children = Array.from(msaGroups.entries()).map(([msaKey, pgSet]) => {
          const msaMetrics = computeUnitStats("msa", msaKey);
          return {
            id: msaKey,
            name: getUnitLabel("msa", msaKey),
            key: msaKey,
            level: "msa",
            value: Math.max(msaMetrics?.totalPatients || pgSet.size || 1, 1),
            attentionLevel: msaMetrics?.attentionLevel || "good",
            fill: COLOR_MAP[msaMetrics?.attentionLevel || "good"],
            color: COLOR_MAP[msaMetrics?.attentionLevel || "good"],
            metrics: msaMetrics,
            children: getPGNodesForUnit(Array.from(pgSet)),
            pgs: Array.from(pgSet)
          };
        });
      } else {
        node.children = getPGNodesForUnit(option.pgs);
      }

      root.children.push(node);
      root.value += node.value;
    });

    if (!root.value) {
      root.value = 1;
    }

    return root;
  }, [levelSummaries, selectedLevel, computeUnitStats, getPGNodesForUnit, getUnitLabel, pgMetrics]);

  const unitStats = useMemo(
    () => (selectedKey ? computeUnitStats(selectedLevel, selectedKey) : null),
    [selectedKey, selectedLevel, computeUnitStats]
  );

  const unitNodes = hierarchyData.children || [];

  const selectedNode = useMemo(
    () => unitNodes.find((child) => child.key === selectedKey) || null,
    [unitNodes, selectedKey]
  );

  const mapNodes = useMemo(() => {
    return unitNodes
      .map((node) => {
        const center = getUnitCenter(selectedLevel, node);
        if (!center) return null;
        const patientCount = node.metrics?.totalPatients || node.value || 1;
        const scale = selectedLevel === "county" ? 0.6 : 0.9;
        const radius = Math.min(60, Math.max(8, Math.sqrt(patientCount) * scale));
        return {
          node,
          center,
          radius,
          color: node.color,
          isSelected: node.key === selectedKey
        };
      })
      .filter(Boolean);
  }, [unitNodes, selectedLevel, selectedKey, getUnitCenter]);

  const pgMarkers = useMemo(() => {
    if (!selectedNode) return [];
    const entries = (selectedNode.pgs || [])
      .map((pgId) => pgMetrics.get(pgId))
      .filter(Boolean)
      .map((entry) => {
        const center = getPgCoordinate(entry.pg);
        if (!center) return null;
        return {
          center,
          metric: entry
        };
      })
      .filter(Boolean);

    entries.sort((a, b) => b.metric.totalIssues - a.metric.totalIssues);
    return entries.slice(0, Math.min(entries.length, 75));
  }, [selectedNode, pgMetrics, getPgCoordinate]);

  const mapFocus = useMemo(() => {
    if (selectedNode) {
      const center = getUnitCenter(selectedLevel, selectedNode);
      if (center) {
        const zoom =
          (selectedLevel === "gsa" && GSA_COORDINATE_LOOKUP[selectedNode.key]?.zoom) ||
          (selectedLevel === "msa" && MSA_COORDINATE_LOOKUP[selectedNode.key]?.zoom) ||
          LEVEL_DEFAULT_ZOOM[selectedLevel] ||
          DEFAULT_MAP_ZOOM;
        return { center, zoom };
      }
    }
    return { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM };
  }, [selectedNode, selectedLevel, getUnitCenter]);

  const handleNavigateToPG = useCallback(
    (pg, context = {}) => {
      if (!pg) return;
      const payload = {
        source: context.source || "services-dashboard",
        focusArea: context.focusArea || "services",
        unitLevel: selectedLevel,
        unitKey: selectedKey,
        unitName: unitStats?.unitName,
        attentionLevel: context.attentionLevel || unitStats?.attentionLevel || "good",
        metrics: context.metrics || unitStats?.cards || {},
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem("servicesDashboardSelectedPG", pg.name);
      sessionStorage.setItem("servicesDashboardContext", JSON.stringify(payload));

      navigate("/PGDashboardNew");
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("navigateToServices", {
            detail: {
              ...payload,
              pgName: pg.name,
              pgId: pg.id
            }
          })
        );
      }, 250);
    },
    [navigate, selectedKey, selectedLevel, unitStats]
  );

  const handleSegmentClick = useCallback(
    (node) => {
      if (!node || !node.level || node.level === "root") return;
      if (["gsa", "msa", "division", "county"].includes(node.level)) {
        setSelectedLevel(node.level);
        setSelectedKey(node.key);
        return;
      }
      if (node.level === "pg") {
        const metric = pgMetrics.get(node.key);
        if (!metric) return;
        handleNavigateToPG(metric.pg, {
          source: "map",
          focusArea: "overview",
          attentionLevel: metric.attentionLevel,
          metrics: metric.metrics
        });
      }
    },
    [pgMetrics, handleNavigateToPG]
  );

  const handlePgMarkerClick = useCallback(
    (metric) => {
      if (!metric) return;
      handleNavigateToPG(metric.pg, {
        source: "map",
        focusArea: "services",
        attentionLevel: metric.attentionLevel,
        metrics: metric.metrics
      });
    },
    [handleNavigateToPG]
  );

  const renderUnitTooltip = useCallback((data) => {
    if (!data) return null;
    const levelLabel = formatLabel((data.level || "").toString());
    const attentionLabel = formatLabel(((data.attentionLevel || "good").toString()).replace("-", " "));
    const totalPatients = data.metrics?.totalPatients ?? data.totalPatients;
    const totalIssues = data.metrics?.totalIssues ?? data.totalIssues;

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-slate-900">{data.name}</p>
        {levelLabel ? (
          <p className="text-xs capitalize text-slate-500">{levelLabel}</p>
        ) : null}
        <Separator className="my-2" />
        <div className="space-y-1 text-xs text-slate-600">
          <p>
            Attention level: <span className="capitalize">{attentionLabel}</span>
          </p>
          {typeof totalPatients === "number" ? <p>Total patients: {totalPatients}</p> : null}
          {typeof totalIssues === "number" ? <p>Open issues: {totalIssues}</p> : null}
        </div>
      </div>
    );
  }, []);

  const selectedOptions = levelSummaries[selectedLevel] || [];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50/30 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6">
          <Card className="border-none bg-white/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Layers className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Services Command Center</span>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900">Services Health Overview</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Monitor service performance across geographies and drill into physician groups instantly.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-500">Hierarchy Level</span>
                  <ToggleGroup
                    type="single"
                    value={selectedLevel}
                    onValueChange={(value) => value && setSelectedLevel(value)}
                    className="flex flex-wrap gap-2"
                  >
                    {LEVEL_OPTIONS.map((option) => (
                      <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        aria-label={`Select ${option.label}`}
                        className={cn(
                          "rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition",
                          selectedLevel === option.value
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "bg-white text-slate-600 hover:bg-indigo-50"
                        )}
                      >
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="flex flex-col gap-2 lg:w-80">
                  <span className="text-xs font-semibold uppercase text-slate-500">Select {LEVEL_OPTIONS.find((lvl) => lvl.value === selectedLevel)?.label}</span>
                  <Select
                    value={selectedKey || undefined}
                    onValueChange={(value) => setSelectedKey(value)}
                  >
                    <SelectTrigger className="w-full rounded-xl border-2 border-indigo-100 bg-white/80">
                      <SelectValue placeholder={`Choose a ${LEVEL_OPTIONS.find((lvl) => lvl.value === selectedLevel)?.label}`} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xl">
                      {selectedOptions.map((option) => (
                        <SelectItem key={option.key} value={option.key} className="rounded-lg px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-900">{option.label}</span>
                            <span className="text-xs text-slate-500">
                              {option.totalPatients || option.pgs.length} patients • {option.pgs.length} PGs
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-none bg-white/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-indigo-600">
                <Target className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Service Impact Map</span>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                {unitStats?.unitName || "Unified Services Health"}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Explore the service footprint by geography—marker size reflects patient volume, and color flags urgency. Click any region or pin to drill down or jump into a physician group.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="h-[460px] rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 p-1 shadow-inner">
                  <ServiceImpactLeafletMap
                    nodes={mapNodes}
                    pgMarkers={pgMarkers}
                    focus={mapFocus}
                    onNodeClick={handleSegmentClick}
                    onPgClick={handlePgMarkerClick}
                    renderTooltip={renderUnitTooltip}
                    selectedLevel={selectedLevel}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Card className="border-none bg-white/90 shadow">
                    <CardContent className="space-y-3 pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase text-slate-500">Snapshot</span>
                        <Badge
                          variant="outline"
                          className="capitalize"
                          style={unitStats ? { backgroundColor: `${unitStats.color}1A`, color: unitStats.color } : undefined}
                        >
                          {formatLabel((unitStats?.attentionLevel || "good").replace("-", " "))}
                        </Badge>
                      </div>
                      <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs uppercase text-slate-500">Physician Groups</p>
                            <p className="text-2xl font-semibold text-slate-900">{unitStats?.totalPGs ?? "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-slate-500">Active Patients</p>
                            <p className="text-2xl font-semibold text-slate-900">{unitStats?.totalPatients ?? "-"}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Use the interactive map to spot hotspots. Selecting a region keeps the cards in sync with your current focus.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl">
                    <CardContent className="space-y-3 pt-6">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wide">Next Best Action</p>
                          <p className="text-xs text-indigo-100">
                            Click on a status card to open the PG list and jump directly into guided workflows.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {CARD_CONFIG.map((card) => {
              const cardData = unitStats?.cards?.[card.key];
              const total = cardData?.total ?? 0;
              const topGroup = cardData?.breakdown?.[0];

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setDialogState({ open: true, cardKey: card.key })}
                  className="group text-left"
                >
                  <Card
                    className={cn(
                      "h-full border-2 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl",
                      card.accent
                    )}
                  >
                    <CardContent className="flex h-full flex-col gap-4 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-white/70 p-2 text-slate-600">
                            <card.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{card.title}</p>
                            <p className="text-xs text-slate-500">{card.description}</p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={card.badge}>{total}</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total open items in this category</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="rounded-lg bg-white/80 p-3">
                        {total > 0 && topGroup ? (
                          <div className="space-y-2">
                            <p className="text-xs uppercase text-slate-500">Top PG</p>
                            <p className="text-sm font-semibold text-slate-800">{topGroup.pgName}</p>
                            <p className="text-xs text-slate-500">{topGroup.count} open items</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-2">
                            <p className="text-sm font-medium text-emerald-600">All clear</p>
                            <p className="text-xs text-slate-500">No outstanding work in this category.</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-end text-xs font-semibold text-indigo-600">
                        Review details
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>

        <Dialog
          open={dialogState.open}
          onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{CARD_CONFIG.find((card) => card.key === dialogState.cardKey)?.title || "Status"}</DialogTitle>
              <DialogDescription>
                Review physician groups affected within the selected geography and jump into their dashboards for guided workflows.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[360px] pr-4">
              <div className="space-y-4">
                {dialogState.cardKey && unitStats?.cards?.[dialogState.cardKey]?.breakdown?.length ? (
                  unitStats.cards[dialogState.cardKey].breakdown.map((item) => (
                    <div
                      key={item.pgId}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/90 p-4"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.pgName}</p>
                        <p className="text-xs text-slate-500">{item.count} open items</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ backgroundColor: `${item.color}1A`, color: item.color }}>
                          {formatLabel(item.attentionLevel.replace("-", " "))}
                        </Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-lg"
                          onClick={() => {
                            const metric = pgMetrics.get(item.pgId);
                            handleNavigateToPG(metric?.pg, {
                              source: "services-card",
                              focusArea: dialogState.cardKey,
                              attentionLevel: item.attentionLevel,
                              metrics: metric?.metrics
                            });
                          }}
                        >
                          Open PG Dashboard
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
                    All physician groups are up to date for this category.
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

const MapAutoFocus = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom ?? DEFAULT_MAP_ZOOM, { duration: 0.8 });
    }
  }, [center, zoom, map]);

  return null;
};

const ServiceImpactLeafletMap = ({ nodes, pgMarkers, focus, onNodeClick, onPgClick, renderTooltip, selectedLevel }) => {
  const center = focus?.center || DEFAULT_MAP_CENTER;
  const zoom = focus?.zoom || DEFAULT_MAP_ZOOM;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={3}
        maxZoom={12}
        scrollWheelZoom
        className="h-full w-full rounded-[18px]"
        preferCanvas
      >
        <MapAutoFocus center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attribution">CARTO</a>'
        />
        {nodes.map(({ node, center: nodeCenter, radius, color, isSelected }) => (
          <CircleMarker
            key={node.id}
            center={nodeCenter}
            radius={radius}
            pathOptions={{
              color: isSelected ? "#1D4ED8" : color || "#6366F1",
              fillColor: color || "#6366F1",
              fillOpacity: isSelected ? 0.65 : 0.4,
              weight: isSelected ? 3 : 1.5
            }}
            eventHandlers={{
              click: () => onNodeClick?.(node)
            }}
          >
            <LeafletTooltip direction="top" offset={[0, -radius]} opacity={1} className="pointer-events-none">
              {renderTooltip(node)}
            </LeafletTooltip>
          </CircleMarker>
        ))}
        {pgMarkers.map(({ metric, center: markerCenter }) => {
          const markerKey = metric.pg.id || metric.pg.npi || metric.pg.name;
          const radius = Math.min(14, Math.max(5, Math.sqrt(metric.totalPatients || 1) * 0.5));
          return (
            <CircleMarker
              key={`pg-${markerKey}`}
              center={markerCenter}
              radius={radius}
              pathOptions={{
                color: metric.color,
                fillColor: metric.color,
                fillOpacity: 0.75,
                weight: 1.5
              }}
              eventHandlers={{
                click: () => onPgClick?.(metric)
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -radius]} opacity={1} className="pointer-events-none">
                {renderTooltip({
                  name: metric.pg.name,
                  level: "pg",
                  attentionLevel: metric.attentionLevel,
                  metrics: {
                    totalPatients: metric.totalPatients,
                    totalIssues: metric.totalIssues
                  }
                })}
              </LeafletTooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Legend</p>
        <div className="mt-2 flex flex-col gap-1">
          {Object.entries(COLOR_MAP).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {ATTENTION_LABELS[key] || formatLabel(key)}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] uppercase text-slate-400">Level: {formatLabel(selectedLevel)}</p>
        <p className="text-[10px] text-slate-400">Radius ≈ patient volume</p>
      </div>
    </div>
  );
};

export default ServicesDashboard;
