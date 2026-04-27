import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cn } from "./utils/cn";

type ViewName =
  | "Dashboard"
  | "Offers"
  | "Email Inbox"
  | "Calendar"
  | "Contract Templates"
  | "Team"
  | "Contacts"
  | "Sales Pipeline"
  | "Notifications"
  | "Reports"
  | "Profile";

type OfferStatus = "Available" | "Reserved" | "Sold";
type WorkspaceMode = "General" | "Project";

interface Offer {
  id: string;
  workspaceId?: string;
  buyer: string;
  buyerEmail: string;
  unit: string;
  building: string;
  saleAmount: number;
  optionsAmount: number;
  status: OfferStatus;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaSqFt: number;
  createdAt: string;
  broker: string;
}

interface Contact {
  id: string;
  workspaceId?: string;
  name: string;
  email: string;
  phone: string;
  role: "Buyer" | "Broker" | "Lawyer";
}

interface CalendarEvent {
  id: string;
  workspaceId?: string;
  title: string;
  date: string;
  category: "Call" | "Meeting" | "Deadline";
}

interface TeamMember {
  id: string;
  workspaceId?: string;
  name: string;
  role: string;
  activeDeals: number;
}

interface OfferDraft {
  building: string;
  unit: string;
  buyer: string;
  buyerEmail: string;
  broker: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaSqFt: number;
  saleAmount: number;
  optionsAmount: number;
  status: OfferStatus;
  privacyConsent: boolean;
  fintracCompleted: boolean;
}

interface NotificationItem {
  id: string;
  workspaceId?: string;
  message: string;
  timestamp: string;
}

interface ProjectRecord {
  id: string;
  name: string;
  address: string;
  phase: string;
  totalUnits: number;
  releasedUnits: number;
  targetRevenue: number;
  expectedClose: string;
  buildings: string[];
}

interface Workspace {
  id: string;
  name: string;
  shortCode: string;
  adminEmail: string;
  supportPhone: string;
  projects: ProjectRecord[];
}

interface WorkspaceDraft {
  name: string;
  shortCode: string;
  adminEmail: string;
  supportPhone: string;
  address: string;
}

const sidebarItems: ViewName[] = [
  "Dashboard",
  "Offers",
  "Email Inbox",
  "Calendar",
  "Contract Templates",
  "Team",
  "Contacts",
  "Sales Pipeline",
  "Notifications",
  "Reports",
  "Profile",
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: "off-001",
    workspaceId: "ws-h",
    buyer: "Omar Bator",
    buyerEmail: "omar@buyersuite.com",
    unit: "River Town - #324",
    building: "River Town",
    saleAmount: 20613800,
    optionsAmount: 2613800,
    status: "Available",
    bedrooms: 4,
    bathrooms: 2,
    parkingSpots: 1,
    areaSqFt: 4610,
    createdAt: "2026-03-01",
    broker: "Harbor Realty",
  },
  {
    id: "off-002",
    workspaceId: "ws-h",
    buyer: "Alena Donin",
    buyerEmail: "alena@northmail.ca",
    unit: "Pacifica - #1201",
    building: "Pacifica Tower 1",
    saleAmount: 15400000,
    optionsAmount: 410000,
    status: "Reserved",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 1,
    areaSqFt: 1760,
    createdAt: "2026-03-12",
    broker: "Metro Homes",
  },
  {
    id: "off-003",
    workspaceId: "ws-o",
    buyer: "Lindsey Calzoni",
    buyerEmail: "l.calzoni@email.com",
    unit: "Pacifica - #904",
    building: "Pacifica Tower 1",
    saleAmount: 11950000,
    optionsAmount: 750000,
    status: "Sold",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    areaSqFt: 1320,
    createdAt: "2026-02-23",
    broker: "North Brokerage",
  },
];

const INITIAL_CONTACTS: Contact[] = [
  { id: "c-1", workspaceId: "ws-h", name: "Martin Levin", email: "martin@levin.com", phone: "416-331-8877", role: "Buyer" },
  { id: "c-2", workspaceId: "ws-h", name: "Jocelyn Passaquindici", email: "jocelyn@lakeedge.com", phone: "647-400-1192", role: "Broker" },
  { id: "c-3", workspaceId: "ws-o", name: "Zaire Schleifer", email: "zaire@firmlegal.ca", phone: "416-992-1123", role: "Lawyer" },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "e-1", workspaceId: "ws-h", title: "Call Omar Bator", date: "2026-04-28", category: "Call" },
  { id: "e-2", workspaceId: "ws-h", title: "Pacifica #1201 walkthrough", date: "2026-04-30", category: "Meeting" },
  { id: "e-3", workspaceId: "ws-o", title: "Fintrac docs due - Alena", date: "2026-05-01", category: "Deadline" },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: "t-1", workspaceId: "ws-h", name: "Rita Chen", role: "Senior Agent", activeDeals: 8 },
  { id: "t-2", workspaceId: "ws-h", name: "Samir Patel", role: "Sales Manager", activeDeals: 11 },
  { id: "t-3", workspaceId: "ws-c", name: "Noa Green", role: "Coordinator", activeDeals: 4 },
];

const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-h",
    name: "Hudson 8",
    shortCode: "H",
    adminEmail: "admin@hudson8.ca",
    supportPhone: "416-502-3300",
    projects: [
      {
        id: "project-pacifica",
        name: "Pacifica Tower 1",
        address: "3091 Dundas Street W, Toronto, CA",
        phase: "Sales Phase 2",
        totalUnits: 264,
        releasedUnits: 112,
        targetRevenue: 620000000,
        expectedClose: "2027-11-01",
        buildings: ["Pacifica Tower 1"],
      },
      {
        id: "project-river-town",
        name: "River Town",
        address: "190 Queens Quay E, Toronto, CA",
        phase: "Final Release",
        totalUnits: 98,
        releasedUnits: 98,
        targetRevenue: 280000000,
        expectedClose: "2026-09-15",
        buildings: ["River Town"],
      },
    ],
  },
  {
    id: "ws-o",
    name: "Oakline Collective",
    shortCode: "O",
    adminEmail: "ops@oakline.ca",
    supportPhone: "647-229-8808",
    projects: [
      {
        id: "project-oakline-one",
        name: "Oakline One",
        address: "455 Front St E, Toronto, CA",
        phase: "Sales Launch",
        totalUnits: 182,
        releasedUnits: 64,
        targetRevenue: 410000000,
        expectedClose: "2027-06-20",
        buildings: ["Oakline One", "Pacifica Tower 1"],
      },
    ],
  },
  {
    id: "ws-c",
    name: "Crestpoint Group",
    shortCode: "C",
    adminEmail: "team@crestpoint.ca",
    supportPhone: "437-880-3001",
    projects: [
      {
        id: "project-crestpoint-heights",
        name: "Crestpoint Heights",
        address: "10 Spadina Ave, Toronto, CA",
        phase: "Pre-launch",
        totalUnits: 210,
        releasedUnits: 0,
        targetRevenue: 560000000,
        expectedClose: "2028-02-12",
        buildings: ["Crestpoint Heights"],
      },
    ],
  },
];

const defaultWorkspaceDraft: WorkspaceDraft = {
  name: "",
  shortCode: "",
  adminEmail: "",
  supportPhone: "",
  address: "",
};

const wizardSteps = ["Building", "Units", "Buyer", "Broker", "Parking", "Privacy Consent", "Fintrac", "Review"];

const defaultDraft: OfferDraft = {
  building: "Pacifica Tower 1",
  unit: "#1201",
  buyer: "",
  buyerEmail: "",
  broker: "Harbor Realty",
  bedrooms: 2,
  bathrooms: 2,
  parkingSpots: 1,
  areaSqFt: 1461,
  saleAmount: 105000000,
  optionsAmount: 667300,
  status: "Available",
  privacyConsent: false,
  fintracCompleted: false,
};

const usdCurrency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

function loadState<T>(key: string, fallback: T): T {
  try {
    const parsed = localStorage.getItem(key);
    if (!parsed) return fallback;
    return JSON.parse(parsed) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewName>("Dashboard");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("General");
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => loadState("crm-workspaces", INITIAL_WORKSPACES));
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => loadState("crm-active-workspace", "ws-h"));
  const [selectedProjectId, setSelectedProjectId] = useState("project-pacifica");
  const [offers, setOffers] = useState<Offer[]>(() => loadState("crm-offers", INITIAL_OFFERS));
  const [contacts, setContacts] = useState<Contact[]>(() => loadState("crm-contacts", INITIAL_CONTACTS));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadState("crm-events", INITIAL_EVENTS));
  const [team, setTeam] = useState<TeamMember[]>(() => loadState("crm-team", INITIAL_TEAM));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState("crm-notifications", []));
  const [offerFilter, setOfferFilter] = useState<"All" | OfferStatus>("All");
  const [offerSearch, setOfferSearch] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id ?? "");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [draft, setDraft] = useState<OfferDraft>(defaultDraft);
  const [contactDraft, setContactDraft] = useState({ name: "", email: "", phone: "", role: "Buyer" as Contact["role"] });
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", category: "Call" as CalendarEvent["category"] });
  const [teamDraft, setTeamDraft] = useState({ name: "", role: "", activeDeals: 0 });
  const [pipelineTarget, setPipelineTarget] = useState(220000000);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceDraft, setWorkspaceDraft] = useState<WorkspaceDraft>(defaultWorkspaceDraft);

  useEffect(() => {
    // Enforce default landing state on initial load.
    setActiveView("Dashboard");
    setWorkspaceMode("General");
    setIsWizardOpen(false);
  }, []);

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0],
    [activeWorkspaceId, workspaces]
  );

  useEffect(() => {
    if (workspaces.length === 0) return;
    if (!workspaces.some((workspace) => workspace.id === activeWorkspaceId)) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [activeWorkspaceId, workspaces]);

  useEffect(() => {
    if (!activeWorkspace) return;
    setProfile({
      name: activeWorkspace.name,
      email: activeWorkspace.adminEmail,
      phone: activeWorkspace.supportPhone,
    });
  }, [activeWorkspace]);

  useEffect(() => {
    if (!activeWorkspace) return;
    if (!activeWorkspace.projects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(activeWorkspace.projects[0]?.id ?? "");
    }
  }, [activeWorkspace, selectedProjectId]);

  useEffect(() => {
    localStorage.setItem("crm-workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem("crm-active-workspace", JSON.stringify(activeWorkspaceId));
  }, [activeWorkspaceId]);

  const selectedProject = useMemo(
    () => activeWorkspace?.projects.find((project) => project.id === selectedProjectId) ?? activeWorkspace?.projects[0],
    [activeWorkspace, selectedProjectId]
  );

  const workspaceOffers = useMemo(
    () => offers.filter((offer) => (offer.workspaceId ?? "ws-h") === activeWorkspaceId),
    [activeWorkspaceId, offers]
  );

  const scopedContacts = useMemo(
    () => contacts.filter((contact) => (contact.workspaceId ?? "ws-h") === activeWorkspaceId),
    [activeWorkspaceId, contacts]
  );

  const scopedEvents = useMemo(
    () => events.filter((event) => (event.workspaceId ?? "ws-h") === activeWorkspaceId),
    [activeWorkspaceId, events]
  );

  const scopedTeam = useMemo(
    () => team.filter((member) => (member.workspaceId ?? "ws-h") === activeWorkspaceId),
    [activeWorkspaceId, team]
  );

  const scopedNotifications = useMemo(
    () => notifications.filter((item) => (item.workspaceId ?? "ws-h") === activeWorkspaceId),
    [activeWorkspaceId, notifications]
  );

  const scopedOffers = useMemo(() => {
    if (workspaceMode === "General" || !selectedProject) return workspaceOffers;
    return workspaceOffers.filter((offer) => selectedProject.buildings.includes(offer.building));
  }, [workspaceOffers, selectedProject, workspaceMode]);

  useEffect(() => {
    if (scopedOffers.length === 0) {
      setSelectedOfferId("");
      return;
    }
    if (!scopedOffers.some((offer) => offer.id === selectedOfferId)) {
      setSelectedOfferId(scopedOffers[0].id);
    }
  }, [scopedOffers, selectedOfferId]);

  useEffect(() => {
    if (workspaceMode === "Project" && selectedProject) {
      setDraft((prev) => ({ ...prev, building: selectedProject.buildings[0] ?? prev.building }));
    }
  }, [selectedProject, workspaceMode]);

  useEffect(() => {
    localStorage.setItem("crm-offers", JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem("crm-contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("crm-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("crm-team", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem("crm-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const filteredOffers = useMemo(() => {
    return scopedOffers.filter((offer) => {
      const byFilter = offerFilter === "All" || offer.status === offerFilter;
      const term = offerSearch.trim().toLowerCase();
      const bySearch =
        term.length === 0 ||
        offer.buyer.toLowerCase().includes(term) ||
        offer.unit.toLowerCase().includes(term) ||
        offer.buyerEmail.toLowerCase().includes(term);
      return byFilter && bySearch;
    });
  }, [scopedOffers, offerFilter, offerSearch]);

  const selectedOffer = scopedOffers.find((offer) => offer.id === selectedOfferId) ?? scopedOffers[0];

  const metrics = useMemo(() => {
    const available = scopedOffers.filter((o) => o.status === "Available");
    const reserved = scopedOffers.filter((o) => o.status === "Reserved");
    const sold = scopedOffers.filter((o) => o.status === "Sold");
    return {
      availableAmount: available.reduce((sum, o) => sum + o.saleAmount, 0),
      reservedAmount: reserved.reduce((sum, o) => sum + o.saleAmount, 0),
      totalOfferCreated: scopedOffers.reduce((sum, o) => sum + o.saleAmount, 0),
      soldAmount: sold.reduce((sum, o) => sum + o.saleAmount, 0),
      unitsAvailable: available.length,
      unitsReserved: reserved.length,
      unitsSold: sold.length,
    };
  }, [scopedOffers]);

  function pushNotification(message: string, workspaceId: string = activeWorkspaceId) {
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, workspaceId, message, timestamp: new Date().toLocaleString() },
      ...prev,
    ]);
  }

  function resetWizard() {
    setWizardStep(0);
    setDraft((prev) => ({
      ...defaultDraft,
      building: workspaceMode === "Project" && selectedProject ? (selectedProject.buildings[0] ?? defaultDraft.building) : prev.building,
    }));
  }

  function createWorkspace() {
    const shortCode = workspaceDraft.shortCode.trim().toUpperCase();
    if (workspaceDraft.name.trim().length < 2 || shortCode.length !== 1 || !workspaceDraft.adminEmail.includes("@")) {
      return;
    }
    if (workspaces.some((workspace) => workspace.shortCode.toUpperCase() === shortCode)) {
      return;
    }

    const workspaceId = `ws-${Date.now()}`;
    const projectId = `project-${Date.now()}`;
    const workspaceName = workspaceDraft.name.trim();
    const projectName = `${workspaceName} Core`;

    const newWorkspace: Workspace = {
      id: workspaceId,
      name: workspaceName,
      shortCode,
      adminEmail: workspaceDraft.adminEmail.trim(),
      supportPhone: workspaceDraft.supportPhone.trim() || "Not set",
      projects: [
        {
          id: projectId,
          name: projectName,
          address: workspaceDraft.address.trim() || "Address pending",
          phase: "Pre-launch",
          totalUnits: 0,
          releasedUnits: 0,
          targetRevenue: 0,
          expectedClose: new Date().toISOString().slice(0, 10),
          buildings: [projectName],
        },
      ],
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspaceId(workspaceId);
    setSelectedProjectId(projectId);
    setActiveView("Dashboard");
    setWorkspaceMode("General");
    setWorkspaceDraft(defaultWorkspaceDraft);
    setIsWorkspaceModalOpen(false);
    pushNotification(`Workspace created: ${workspaceName}`, workspaceId);
  }

  function canProceedStep() {
    if (wizardStep === 0) return draft.building.trim().length > 2;
    if (wizardStep === 1) return draft.unit.trim().length > 1;
    if (wizardStep === 2) return draft.buyer.trim().length > 2 && draft.buyerEmail.includes("@");
    if (wizardStep === 3) return draft.broker.trim().length > 2;
    if (wizardStep === 4) return draft.parkingSpots >= 0;
    if (wizardStep === 5) return draft.privacyConsent;
    if (wizardStep === 6) return draft.fintracCompleted;
    return true;
  }

  function saveOffer() {
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      buyer: draft.buyer,
      buyerEmail: draft.buyerEmail,
      unit: `${draft.building} - ${draft.unit}`,
      building: draft.building,
      saleAmount: draft.saleAmount,
      optionsAmount: draft.optionsAmount,
      status: draft.status,
      bedrooms: draft.bedrooms,
      bathrooms: draft.bathrooms,
      parkingSpots: draft.parkingSpots,
      areaSqFt: draft.areaSqFt,
      createdAt: new Date().toISOString().slice(0, 10),
      broker: draft.broker,
    };
    setOffers((prev) => [newOffer, ...prev]);
    setSelectedOfferId(newOffer.id);
    if (!scopedContacts.some((c) => c.email === draft.buyerEmail)) {
      setContacts((prev) => [
        { id: `c-${Date.now()}`, workspaceId: activeWorkspaceId, name: draft.buyer, email: draft.buyerEmail, phone: "", role: "Buyer" },
        ...prev,
      ]);
    }
    pushNotification(`Offer created for ${draft.buyer} (${draft.unit})`);
    setIsWizardOpen(false);
    resetWizard();
  }

  function renderMainView() {
    if (activeView === "Offers") {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {[{
              title: "Total Available",
              amount: metrics.availableAmount,
              units: metrics.unitsAvailable,
            }, {
              title: "Total Reserved",
              amount: metrics.reservedAmount,
              units: metrics.unitsReserved,
            }, {
              title: "Total Offer Created",
              amount: metrics.totalOfferCreated,
              units: scopedOffers.length,
            }, {
              title: "Total Sold Firm",
              amount: metrics.soldAmount,
              units: metrics.unitsSold,
            }].map((item) => (
              <div key={item.title} className="bg-white/70 px-4 py-5">
                <p className="text-[11px] uppercase tracking-wide text-black/60">{item.title}</p>
                <p className="mt-2 text-2xl font-semibold">{usdCurrency.format(item.amount)}</p>
                <p className="mt-1 text-xs text-black/55">{item.units} Units</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-black/10 py-3">
            <div className="flex items-center gap-2">
              <input
                className="h-9 w-64 border border-black/20 bg-white px-3 text-sm outline-none"
                placeholder="Search buyer, unit, or email"
                value={offerSearch}
                onChange={(event) => setOfferSearch(event.target.value)}
              />
              <select
                className="h-9 border border-black/20 bg-white px-2 text-sm outline-none"
                value={offerFilter}
                onChange={(event) => setOfferFilter(event.target.value as "All" | OfferStatus)}
              >
                <option value="All">All statuses</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            <p className="text-xs text-black/60">{filteredOffers.length} offers shown</p>
          </div>

          <div className="overflow-hidden border border-black/10">
            <div className="grid grid-cols-[2fr_1.8fr_1.4fr_1.6fr_1fr] bg-black/5 px-4 py-2 text-[11px] uppercase tracking-wide text-black/60">
              <span>Buyer</span>
              <span>Unit</span>
              <span>Sale Amount</span>
              <span>Amount + Options</span>
              <span>Status</span>
            </div>
            <div className="max-h-[280px] overflow-auto bg-white/80">
              {filteredOffers.map((offer) => (
                <motion.button
                  key={offer.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                  className={cn(
                    "grid w-full grid-cols-[2fr_1.8fr_1.4fr_1.6fr_1fr] items-center border-t border-black/10 px-4 py-3 text-left text-sm",
                    selectedOffer?.id === offer.id && "bg-black/5"
                  )}
                  onClick={() => setSelectedOfferId(offer.id)}
                >
                  <span className="font-medium">{offer.buyer}</span>
                  <span>{offer.unit}</span>
                  <span>{usdCurrency.format(offer.saleAmount)}</span>
                  <span>{usdCurrency.format(offer.saleAmount + offer.optionsAmount)}</span>
                  <span>
                    <span
                      className={cn(
                        "inline-flex min-w-20 justify-center px-2 py-1 text-xs font-semibold uppercase",
                        offer.status === "Available" && "bg-lime-300/90",
                        offer.status === "Reserved" && "bg-amber-200",
                        offer.status === "Sold" && "bg-neutral-200"
                      )}
                    >
                      {offer.status}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {selectedOffer && (
            <div className="grid gap-5 border-t border-black/10 pt-4 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <h3 className="text-xs uppercase tracking-wide text-black/60">Unit Details</h3>
                <div className="mt-2 grid gap-3 md:grid-cols-[220px_1fr]">
                  <svg viewBox="0 0 220 140" className="h-36 w-full border border-black/15 bg-white p-2">
                    <rect x="5" y="5" width="90" height="60" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="100" y="5" width="50" height="60" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="155" y="5" width="60" height="35" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="155" y="45" width="60" height="55" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="5" y="70" width="70" height="65" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="80" y="70" width="70" height="65" fill="none" stroke="black" strokeWidth="1" />
                    <rect x="155" y="105" width="60" height="30" fill="none" stroke="black" strokeWidth="1" />
                    <text x="12" y="20" fontSize="8">Master</text>
                    <text x="110" y="20" fontSize="8">Kitchen</text>
                    <text x="160" y="20" fontSize="8">Balcony</text>
                    <text x="160" y="60" fontSize="8">Living</text>
                    <text x="12" y="90" fontSize="8">Bath 1</text>
                    <text x="86" y="90" fontSize="8">Bath 2</text>
                  </svg>
                  <div className="text-sm">
                    <p className="text-xl font-semibold">{selectedOffer.unit}</p>
                    <p className="mt-1 text-black/65">
                      {selectedOffer.areaSqFt.toLocaleString()} sq.ft, {selectedOffer.bedrooms} bedrooms, {selectedOffer.bathrooms} bathrooms
                    </p>
                    <p className="mt-3">Address: 3091 Dundas Street W, Toronto, CA</p>
                    <p>Building: {selectedOffer.building}</p>
                    <p>Broker: {selectedOffer.broker}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <h3 className="text-xs uppercase tracking-wide text-black/60">Financial Summary</h3>
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>Sale Value</span>
                  <span className="font-semibold">{usdCurrency.format(selectedOffer.saleAmount)}</span>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>Options + Upgrades</span>
                  <span className="font-semibold">{usdCurrency.format(selectedOffer.optionsAmount)}</span>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>Total Contract</span>
                  <span className="font-semibold">{usdCurrency.format(selectedOffer.saleAmount + selectedOffer.optionsAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold">{selectedOffer.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeView === "Contacts") {
      return (
        <div className="space-y-4">
          <form
            className="grid gap-2 border-b border-black/10 pb-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (contactDraft.name.trim().length < 2 || !contactDraft.email.includes("@")) return;
              const newContact: Contact = { id: `c-${Date.now()}`, workspaceId: activeWorkspaceId, ...contactDraft };
              setContacts((prev) => [newContact, ...prev]);
              pushNotification(`Contact created: ${newContact.name}`);
              setContactDraft({ name: "", email: "", phone: "", role: "Buyer" });
            }}
          >
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Name" value={contactDraft.name} onChange={(event) => setContactDraft((prev) => ({ ...prev, name: event.target.value }))} />
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Email" value={contactDraft.email} onChange={(event) => setContactDraft((prev) => ({ ...prev, email: event.target.value }))} />
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Phone" value={contactDraft.phone} onChange={(event) => setContactDraft((prev) => ({ ...prev, phone: event.target.value }))} />
            <select className="h-9 border border-black/20 bg-white px-2 text-sm" value={contactDraft.role} onChange={(event) => setContactDraft((prev) => ({ ...prev, role: event.target.value as Contact["role"] }))}>
              <option>Buyer</option>
              <option>Broker</option>
              <option>Lawyer</option>
            </select>
            <button className="h-9 border border-black bg-black px-3 text-sm text-white">Add Contact</button>
          </form>
          <div className="divide-y divide-black/10 border border-black/10 bg-white/80">
            {scopedContacts.map((contact) => (
              <div key={contact.id} className="grid items-center gap-2 px-3 py-2 text-sm md:grid-cols-[1.4fr_1.6fr_1fr_0.8fr_auto]">
                <span className="font-medium">{contact.name}</span>
                <span>{contact.email}</span>
                <span>{contact.phone || "No phone"}</span>
                <span>{contact.role}</span>
                <button
                  className="h-8 border border-black/20 px-2 text-xs"
                  onClick={() => {
                    setContacts((prev) => prev.filter((item) => item.id !== contact.id));
                    pushNotification(`Contact removed: ${contact.name}`);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === "Calendar") {
      return (
        <div className="space-y-4">
          <form
            className="grid gap-2 border-b border-black/10 pb-4 md:grid-cols-[2fr_1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!eventDraft.title || !eventDraft.date) return;
              setEvents((prev) => [{ id: `e-${Date.now()}`, workspaceId: activeWorkspaceId, ...eventDraft }, ...prev]);
              pushNotification(`Calendar event added: ${eventDraft.title}`);
              setEventDraft({ title: "", date: "", category: "Call" });
            }}
          >
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Event title" value={eventDraft.title} onChange={(event) => setEventDraft((prev) => ({ ...prev, title: event.target.value }))} />
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" type="date" value={eventDraft.date} onChange={(event) => setEventDraft((prev) => ({ ...prev, date: event.target.value }))} />
            <select className="h-9 border border-black/20 bg-white px-2 text-sm" value={eventDraft.category} onChange={(event) => setEventDraft((prev) => ({ ...prev, category: event.target.value as CalendarEvent["category"] }))}>
              <option>Call</option>
              <option>Meeting</option>
              <option>Deadline</option>
            </select>
            <button className="h-9 border border-black bg-black px-3 text-sm text-white">Add Event</button>
          </form>
          <div className="space-y-2">
            {scopedEvents
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between border border-black/10 bg-white/80 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-black/65">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{item.date}</span>
                    <button className="text-xs text-black/60 underline" onClick={() => setEvents((prev) => prev.filter((entry) => entry.id !== item.id))}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (activeView === "Team") {
      return (
        <div className="space-y-4">
          <form
            className="grid gap-2 border-b border-black/10 pb-4 md:grid-cols-[1.4fr_1.4fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!teamDraft.name.trim() || !teamDraft.role.trim()) return;
              const newMember: TeamMember = { id: `t-${Date.now()}`, workspaceId: activeWorkspaceId, ...teamDraft };
              setTeam((prev) => [newMember, ...prev]);
              pushNotification(`Team member added: ${newMember.name}`);
              setTeamDraft({ name: "", role: "", activeDeals: 0 });
            }}
          >
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Name" value={teamDraft.name} onChange={(event) => setTeamDraft((prev) => ({ ...prev, name: event.target.value }))} />
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" placeholder="Role" value={teamDraft.role} onChange={(event) => setTeamDraft((prev) => ({ ...prev, role: event.target.value }))} />
            <input className="h-9 border border-black/20 bg-white px-2 text-sm" type="number" min={0} placeholder="Active deals" value={teamDraft.activeDeals} onChange={(event) => setTeamDraft((prev) => ({ ...prev, activeDeals: Number(event.target.value) }))} />
            <button className="h-9 border border-black bg-black px-3 text-sm text-white">Add Member</button>
          </form>
          <div className="space-y-2">
            {scopedTeam.map((member) => (
              <div key={member.id} className="flex items-center justify-between border border-black/10 bg-white/80 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-black/65">{member.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{member.activeDeals} active deals</span>
                  <button className="text-xs text-black/60 underline" onClick={() => setTeam((prev) => prev.filter((entry) => entry.id !== member.id))}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === "Reports") {
      const soldByMonth = scopedOffers.reduce<Record<string, number>>((acc, offer) => {
        const month = offer.createdAt.slice(0, 7);
        acc[month] = (acc[month] ?? 0) + offer.saleAmount + offer.optionsAmount;
        return acc;
      }, {});
      const monthEntries = Object.entries(soldByMonth).sort((a, b) => a[0].localeCompare(b[0]));
      const totalPipeline = scopedOffers.reduce((sum, offer) => sum + offer.saleAmount + offer.optionsAmount, 0);
      const progress = Math.min((totalPipeline / pipelineTarget) * 100, 100);

      return (
        <div className="space-y-5">
          <div className="border border-black/10 bg-white/80 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Pipeline Progress</p>
              <input
                type="number"
                min={0}
                className="h-8 w-40 border border-black/20 px-2 text-sm"
                value={pipelineTarget}
                onChange={(event) => setPipelineTarget(Number(event.target.value))}
              />
            </div>
            <div className="mt-3 h-3 w-full bg-black/10">
              <div className="h-full bg-lime-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-black/65">
              {usdCurrency.format(totalPipeline)} of {usdCurrency.format(pipelineTarget)} ({progress.toFixed(1)}%)
            </p>
          </div>
          <div className="space-y-3">
            {monthEntries.map(([month, value]) => (
              <div key={month}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{month}</span>
                  <span>{usdCurrency.format(value)}</span>
                </div>
                <div className="h-2 w-full bg-black/10">
                  <div className="h-full bg-black/70" style={{ width: `${Math.min((value / totalPipeline) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === "Contract Templates") {
      const template = `Agreement between ${selectedOffer?.buyer ?? "Buyer"} and ${selectedOffer?.broker ?? "Broker"}\n\nProperty: ${selectedOffer?.unit ?? "Unit"}\nPrice: ${usdCurrency.format(selectedOffer?.saleAmount ?? 0)}\nOptions: ${usdCurrency.format(selectedOffer?.optionsAmount ?? 0)}\n\nBy signing, both parties confirm all conditions are met.`;
      return (
        <div className="space-y-4">
          <p className="text-sm text-black/70">Generated contract draft from selected offer.</p>
          <textarea readOnly className="min-h-72 w-full border border-black/10 bg-white/80 p-3 text-sm" value={template} />
          <button
            className="h-9 border border-black bg-black px-4 text-sm text-white"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(template);
                pushNotification("Contract template copied to clipboard");
              } catch {
                pushNotification("Clipboard not available in this browser");
              }
            }}
          >
            Copy Template
          </button>
        </div>
      );
    }

    if (activeView === "Dashboard" || activeView === "Sales Pipeline") {
      const totalValue = scopedOffers.reduce((sum, offer) => sum + offer.saleAmount + offer.optionsAmount, 0);
      const closingSoon = scopedEvents.filter((event) => event.category === "Deadline").length;
      return (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-black/10 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-black/60">Total Pipeline</p>
              <p className="mt-1 text-2xl font-semibold">{usdCurrency.format(totalValue)}</p>
            </div>
            <div className="border border-black/10 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-black/60">Open Offers</p>
              <p className="mt-1 text-2xl font-semibold">{scopedOffers.filter((offer) => offer.status !== "Sold").length}</p>
            </div>
            <div className="border border-black/10 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-black/60">Deadlines This Week</p>
              <p className="mt-1 text-2xl font-semibold">{closingSoon}</p>
            </div>
          </div>
          <div className="space-y-2 border-t border-black/10 pt-3">
            <p className="text-sm font-medium">Upcoming Activity</p>
            {scopedEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex justify-between border border-black/10 bg-white/80 px-3 py-2 text-sm">
                <span>{event.title}</span>
                <span>{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeView === "Notifications") {
      return (
        <div className="space-y-2">
          {scopedNotifications.length === 0 && <p className="text-sm text-black/65">No notifications yet.</p>}
          {scopedNotifications.map((notification) => (
            <div key={notification.id} className="border border-black/10 bg-white/80 px-3 py-2 text-sm">
              <p>{notification.message}</p>
              <p className="text-xs text-black/60">{notification.timestamp}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeView === "Profile") {
      return (
        <form
          className="max-w-xl space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setWorkspaces((prev) =>
              prev.map((workspace) =>
                workspace.id === activeWorkspaceId
                  ? {
                      ...workspace,
                      name: profile.name,
                      adminEmail: profile.email,
                      supportPhone: profile.phone,
                    }
                  : workspace
              )
            );
            pushNotification("Profile updated");
          }}
        >
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-black/60">Organization Name</span>
            <input className="h-9 w-full border border-black/20 bg-white px-2" value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-black/60">Admin Email</span>
            <input className="h-9 w-full border border-black/20 bg-white px-2" value={profile.email} onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-black/60">Support Phone</span>
            <input className="h-9 w-full border border-black/20 bg-white px-2" value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} />
          </label>
          <button className="h-9 border border-black bg-black px-4 text-sm text-white">Save Profile</button>
        </form>
      );
    }

    return (
      <div className="border border-black/10 bg-white/80 px-4 py-3 text-sm text-black/70">
        This section is active and ready. Use Offers, Contacts, Calendar, Team, Reports, and Contract Templates for full workflows.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ececea] p-5 text-[#1a1a1a] md:p-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-black/10 bg-[#f3f3f1] shadow-[0_28px_80px_rgba(0,0,0,0.15)]">
          <div className="flex min-h-[760px]">
            <div className="w-16 border-r border-black/10 bg-[#e6e6e4] py-4">
              <div className="flex flex-col items-center gap-3">
                {workspaces.map((workspace) => (
                  <motion.button
                    key={workspace.id}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "grid h-10 w-10 place-content-center border text-sm font-semibold",
                      activeWorkspaceId === workspace.id ? "border-black bg-white" : "border-black/20 text-black/75"
                    )}
                    onClick={() => setActiveWorkspaceId(workspace.id)}
                  >
                    {workspace.shortCode}
                  </motion.button>
                ))}
                <button
                  className="mt-1 h-10 w-10 border border-black/25 text-xl leading-none"
                  onClick={() => setIsWorkspaceModalOpen(true)}
                >
                  +
                </button>
              </div>
            </div>

            <aside className="w-64 border-r border-black/10 bg-[#dededd] p-4">
              <h1 className="text-2xl font-semibold">{activeWorkspace?.name ?? "Workspace"}</h1>
              <div className="mt-4 inline-flex border border-black/20 text-sm">
                <button
                  className={cn(
                    "h-8 px-4",
                    workspaceMode === "General" ? "bg-black text-white" : "bg-transparent text-black/75"
                  )}
                  onClick={() => setWorkspaceMode("General")}
                >
                  General
                </button>
                <button
                  className={cn(
                    "h-8 border-l border-black/20 px-4",
                    workspaceMode === "Project" ? "bg-black text-white" : "bg-transparent text-black/75"
                  )}
                  onClick={() => setWorkspaceMode("Project")}
                >
                  Project
                </button>
              </div>
              <nav className="mt-6 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item}
                    className={cn(
                      "relative flex h-9 w-full items-center px-3 text-left text-sm",
                      activeView === item ? "text-black" : "text-black/70"
                    )}
                    onClick={() => setActiveView(item)}
                  >
                    {activeView === item && (
                      <motion.span
                        layoutId="navHighlight"
                        className="absolute inset-0 bg-white/65"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{item}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <main className="flex-1 p-6">
              <header className="mb-5 flex items-center justify-between border-b border-black/15 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/60">{workspaceMode} Workspace</p>
                  <h2 className="text-4xl font-semibold tracking-tight">{activeView}</h2>
                  <p className="text-xs text-black/60">{activeWorkspace?.adminEmail}</p>
                </div>
                <button
                  className="h-9 border border-black px-3 text-sm"
                  onClick={() => {
                    setActiveView("Offers");
                    setIsWizardOpen(true);
                  }}
                >
                  + Create Offer
                </button>
              </header>

              {workspaceMode === "Project" && (
                <div className="mb-5 border border-black/10 bg-white/70 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-black/60">Project Context</p>
                      <select
                        value={selectedProjectId}
                        onChange={(event) => setSelectedProjectId(event.target.value)}
                        className="h-9 min-w-56 border border-black/20 bg-white px-2 text-sm"
                      >
                        {(activeWorkspace?.projects ?? []).map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{selectedProject?.phase ?? "No phase"}</p>
                      <p className="text-black/60">Expected close: {selectedProject?.expectedClose ?? "-"}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-black/60">Address</p>
                      <p>{selectedProject?.address ?? "No project selected"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-black/60">Released Inventory</p>
                      <p>
                        {(selectedProject?.releasedUnits ?? 0)} / {(selectedProject?.totalUnits ?? 0)} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-black/60">Project Revenue Goal</p>
                      <p>{usdCurrency.format(selectedProject?.targetRevenue ?? 0)}</p>
                    </div>
                  </div>
                </div>
              )}

              {renderMainView()}
            </main>
          </div>

          <AnimatePresence>
            {isWizardOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-5 left-1/2 z-50 w-[92%] max-w-[920px] -translate-x-1/2 border border-black/20 bg-[#f2f2f0] shadow-[0_18px_70px_rgba(0,0,0,0.24)]"
              >
                <div className="flex items-center justify-between border-b border-black/15 px-6 py-4">
                  <h3 className="text-5xl font-semibold tracking-tight">Create Offer</h3>
                  <button className="text-sm" onClick={() => setIsWizardOpen(false)}>
                    Cancel
                  </button>
                </div>

                <div className="grid min-h-[460px] grid-cols-[220px_1fr]">
                  <div className="border-r border-black/10 bg-white/60 p-5">
                    {wizardSteps.map((step, index) => (
                      <div key={step} className="flex gap-3 pb-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "grid h-7 w-7 place-content-center rounded-full border text-xs",
                              index <= wizardStep ? "border-black bg-black text-white" : "border-black/30 text-black/50"
                            )}
                          >
                            {index + 1}
                          </span>
                          {index < wizardSteps.length - 1 && <span className="mt-1 h-7 w-px bg-black/20" />}
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-black/60">Step {index + 1}</p>
                          <p className="text-sm font-medium">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={wizardStep}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.22 }}
                        className="flex-1"
                      >
                        <h4 className="mb-4 border-b border-black/15 pb-3 text-2xl font-semibold">{wizardSteps[wizardStep]}</h4>
                        {wizardStep === 0 && (
                          <div className="space-y-3">
                            <label className="block text-sm">
                              <span className="mb-1 block">Building</span>
                              <input className="h-10 w-full border border-black/20 bg-white px-2" value={draft.building} onChange={(event) => setDraft((prev) => ({ ...prev, building: event.target.value }))} />
                            </label>
                          </div>
                        )}
                        {wizardStep === 1 && (
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-sm">
                              <span className="mb-1 block">Unit</span>
                              <input className="h-10 w-full border border-black/20 bg-white px-2" value={draft.unit} onChange={(event) => setDraft((prev) => ({ ...prev, unit: event.target.value }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Area Sq Ft</span>
                              <input type="number" min={200} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.areaSqFt} onChange={(event) => setDraft((prev) => ({ ...prev, areaSqFt: Number(event.target.value) }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Bedrooms</span>
                              <input type="number" min={0} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.bedrooms} onChange={(event) => setDraft((prev) => ({ ...prev, bedrooms: Number(event.target.value) }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Bathrooms</span>
                              <input type="number" min={0} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.bathrooms} onChange={(event) => setDraft((prev) => ({ ...prev, bathrooms: Number(event.target.value) }))} />
                            </label>
                          </div>
                        )}
                        {wizardStep === 2 && (
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-sm md:col-span-2">
                              <span className="mb-1 block">Buyer Name</span>
                              <input className="h-10 w-full border border-black/20 bg-white px-2" value={draft.buyer} onChange={(event) => setDraft((prev) => ({ ...prev, buyer: event.target.value }))} />
                            </label>
                            <label className="text-sm md:col-span-2">
                              <span className="mb-1 block">Buyer Email</span>
                              <input className="h-10 w-full border border-black/20 bg-white px-2" value={draft.buyerEmail} onChange={(event) => setDraft((prev) => ({ ...prev, buyerEmail: event.target.value }))} />
                            </label>
                          </div>
                        )}
                        {wizardStep === 3 && (
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-sm md:col-span-2">
                              <span className="mb-1 block">Broker</span>
                              <input className="h-10 w-full border border-black/20 bg-white px-2" value={draft.broker} onChange={(event) => setDraft((prev) => ({ ...prev, broker: event.target.value }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Sale Amount</span>
                              <input type="number" min={0} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.saleAmount} onChange={(event) => setDraft((prev) => ({ ...prev, saleAmount: Number(event.target.value) }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Options Amount</span>
                              <input type="number" min={0} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.optionsAmount} onChange={(event) => setDraft((prev) => ({ ...prev, optionsAmount: Number(event.target.value) }))} />
                            </label>
                          </div>
                        )}
                        {wizardStep === 4 && (
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="text-sm">
                              <span className="mb-1 block">Parking Spots</span>
                              <input type="number" min={0} className="h-10 w-full border border-black/20 bg-white px-2" value={draft.parkingSpots} onChange={(event) => setDraft((prev) => ({ ...prev, parkingSpots: Number(event.target.value) }))} />
                            </label>
                            <label className="text-sm">
                              <span className="mb-1 block">Status</span>
                              <select className="h-10 w-full border border-black/20 bg-white px-2" value={draft.status} onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as OfferStatus }))}>
                                <option>Available</option>
                                <option>Reserved</option>
                                <option>Sold</option>
                              </select>
                            </label>
                          </div>
                        )}
                        {wizardStep === 5 && (
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={draft.privacyConsent} onChange={(event) => setDraft((prev) => ({ ...prev, privacyConsent: event.target.checked }))} />
                            Buyer signed privacy consent form.
                          </label>
                        )}
                        {wizardStep === 6 && (
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={draft.fintracCompleted} onChange={(event) => setDraft((prev) => ({ ...prev, fintracCompleted: event.target.checked }))} />
                            Fintrac verification completed.
                          </label>
                        )}
                        {wizardStep === 7 && (
                          <div className="space-y-2 text-sm">
                            <p className="font-medium">Review</p>
                            <p>Buyer: {draft.buyer || "-"}</p>
                            <p>Building: {draft.building}</p>
                            <p>Unit: {draft.unit}</p>
                            <p>Broker: {draft.broker}</p>
                            <p>Total: {usdCurrency.format(draft.saleAmount + draft.optionsAmount)}</p>
                            <p>Compliance: {draft.privacyConsent && draft.fintracCompleted ? "Complete" : "Missing"}</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="mt-5 flex items-center justify-between border-t border-black/15 pt-4">
                      <button
                        className="h-9 border border-black/20 px-3 text-sm disabled:opacity-40"
                        onClick={() => setWizardStep((step) => Math.max(step - 1, 0))}
                        disabled={wizardStep === 0}
                      >
                        Back
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="h-9 border border-black/20 px-3 text-sm" onClick={resetWizard}>
                          Reset
                        </button>
                        {wizardStep < wizardSteps.length - 1 ? (
                          <button
                            className="h-9 border border-black bg-black px-4 text-sm text-white disabled:opacity-50"
                            disabled={!canProceedStep()}
                            onClick={() => setWizardStep((step) => Math.min(step + 1, wizardSteps.length - 1))}
                          >
                            Next Step
                          </button>
                        ) : (
                          <button
                            className="h-9 border border-black bg-lime-300 px-4 text-sm font-medium disabled:opacity-50"
                            disabled={!canProceedStep()}
                            onClick={saveOffer}
                          >
                            Save Offer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isWorkspaceModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] grid place-items-center bg-black/30 p-4"
              >
                <motion.form
                  initial={{ y: 24, opacity: 0.8 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0.8 }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    createWorkspace();
                  }}
                  className="w-full max-w-lg border border-black/20 bg-[#f2f2f0] p-5"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-black/15 pb-3">
                    <h4 className="text-2xl font-semibold">Add Workspace</h4>
                    <button type="button" className="text-sm" onClick={() => setIsWorkspaceModalOpen(false)}>
                      Cancel
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-sm md:col-span-2">
                      <span className="mb-1 block">Workspace Name</span>
                      <input
                        className="h-10 w-full border border-black/20 bg-white px-2"
                        value={workspaceDraft.name}
                        onChange={(event) => setWorkspaceDraft((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Example: Orion Estates"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block">Workspace Letter</span>
                      <input
                        maxLength={1}
                        className="h-10 w-full border border-black/20 bg-white px-2 uppercase"
                        value={workspaceDraft.shortCode}
                        onChange={(event) => setWorkspaceDraft((prev) => ({ ...prev, shortCode: event.target.value.toUpperCase() }))}
                        placeholder="O"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block">Support Phone</span>
                      <input
                        className="h-10 w-full border border-black/20 bg-white px-2"
                        value={workspaceDraft.supportPhone}
                        onChange={(event) => setWorkspaceDraft((prev) => ({ ...prev, supportPhone: event.target.value }))}
                        placeholder="647-000-0000"
                      />
                    </label>
                    <label className="text-sm md:col-span-2">
                      <span className="mb-1 block">Admin Email</span>
                      <input
                        className="h-10 w-full border border-black/20 bg-white px-2"
                        value={workspaceDraft.adminEmail}
                        onChange={(event) => setWorkspaceDraft((prev) => ({ ...prev, adminEmail: event.target.value }))}
                        placeholder="admin@workspace.com"
                      />
                    </label>
                    <label className="text-sm md:col-span-2">
                      <span className="mb-1 block">Primary Project Address</span>
                      <input
                        className="h-10 w-full border border-black/20 bg-white px-2"
                        value={workspaceDraft.address}
                        onChange={(event) => setWorkspaceDraft((prev) => ({ ...prev, address: event.target.value }))}
                        placeholder="100 Main St, Toronto, CA"
                      />
                    </label>
                  </div>
                  <div className="mt-5 flex justify-end gap-2 border-t border-black/15 pt-4">
                    <button
                      type="button"
                      className="h-9 border border-black/20 px-3 text-sm"
                      onClick={() => setWorkspaceDraft(defaultWorkspaceDraft)}
                    >
                      Reset
                    </button>
                    <button type="submit" className="h-9 border border-black bg-black px-4 text-sm text-white">
                      Create Workspace
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
