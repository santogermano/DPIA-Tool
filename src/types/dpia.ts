import { z } from "zod";

export const DataCategory = z.enum(["regular", "special", "sensitive", "criminal", "national-id", "anonymous"]);
export type DataCategory = z.infer<typeof DataCategory>;

export const PartyRole = z.enum(["controller", "joint-controller", "processor", "sub-processor", "provider", "recipient", "third-party"]);
export type PartyRole = z.infer<typeof PartyRole>;

export const LegalBasis = z.enum(["consent", "contract", "legal-obligation", "vital-interests", "public-interest", "legitimate-interest"]);
export type LegalBasis = z.infer<typeof LegalBasis>;

export const RiskLevel = z.enum(["low", "medium", "high", "critical"]);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const Impact = z.enum(["negligible", "unlikely", "medium", "likely", "catastrophic"]);
export type Impact = z.infer<typeof Impact>;

export const Likelihood = z.enum(["negligible", "unlikely", "possible", "likely", "very-likely"]);
export type Likelihood = z.infer<typeof Likelihood>;

export const RiskTreatment = z.enum(["mitigation", "acceptance", "avoidance", "transfer"]);
export type RiskTreatment = z.infer<typeof RiskTreatment>;

export const Status = z.enum(["draft", "under-review", "dpo-reviewed", "approved"]);
export type Status = z.infer<typeof Status>;

// --- Cover page
export const PeopleSchema = z.object({
  department: z.string().default(""),
  dataDomainOwner: z.string().default(""),
  dataSteward: z.string().default(""),
  dpo: z.string().default(""),
  ciso: z.string().default(""),
  projectLeader: z.string().default(""),
  privacyOfficer: z.string().default(""),
  consultedStakeholders: z.string().default(""),
});
export type People = z.infer<typeof PeopleSchema>;

export const VersionEntry = z.object({
  id: z.string(),
  date: z.string().default(""),
  version: z.string().default(""),
  author: z.string().default(""),
  changes: z.string().default(""),
});
export type VersionEntry = z.infer<typeof VersionEntry>;

// --- Section 2 Reasons for DPIA
export const ReasonsSchema = z.object({
  highRisk: z.boolean().default(false),
  listedByAuthority: z.boolean().default(false),
  listedBody: z.string().default(""),
  preDpiaIndicated: z.boolean().default(false),
  preDpiaCriteria: z.string().default(""),
  internalAdvice: z.boolean().default(false),
  internalAdviceBy: z.string().default(""),
  externalAdvice: z.boolean().default(false),
  externalAdviceBy: z.string().default(""),
});
export type Reasons = z.infer<typeof ReasonsSchema>;

// --- Section 4 Data collection
export const DataCollectionSchema = z.object({
  previouslyCollectedTuePurposeOther: z.boolean().default(false),
  previouslyCollectedTuePurposeSame: z.boolean().default(false),
  previouslyCollectedExternal: z.boolean().default(false),
  newCollectedTue: z.boolean().default(false),
  newCollectedWithExternal: z.boolean().default(false),
});
export type DataCollection = z.infer<typeof DataCollectionSchema>;

// --- Section 5 Data Flow Table rows (feeds diagram)
export const DataFlowRow = z.object({
  id: z.string(),
  processingActivity: z.string().default(""),
  processingPurpose: z.string().default(""),
  personalDataCategory: z.string().default(""),
  personalDataItems: z.string().default(""),
  dataCategoryType: DataCategory.default("regular"),
  dataSubjects: z.string().default(""),
  source: z.string().default(""),
  storageLocation: z.string().default(""),
  retentionPeriod: z.string().default(""),
  retentionMotivation: z.string().default(""),
});
export type DataFlowRow = z.infer<typeof DataFlowRow>;

// --- Section 6 Involved parties
export const InvolvedParty = z.object({
  id: z.string(),
  name: z.string().default(""),
  role: PartyRole.default("processor"),
  functions: z.string().default(""),
  interestDescription: z.string().default(""),
  dataCategory: z.string().default(""),
  location: z.string().default(""),
  dpa: z.string().default(""),
  transferMechanism: z.string().default(""),
  isThirdCountry: z.boolean().default(false),
});
export type InvolvedParty = z.infer<typeof InvolvedParty>;

// --- Section 7 Privacy by Design strategies
export const PbdStrategies = z.object({
  minimize: z.string().default(""),
  separate: z.string().default(""),
  abstract: z.string().default(""),
  hide: z.string().default(""),
  inform: z.string().default(""),
  control: z.string().default(""),
  enforce: z.string().default(""),
  demonstrate: z.string().default(""),
  other: z.string().default(""),
});
export type PbdStrategies = z.infer<typeof PbdStrategies>;

// --- Section 8 Tech/method rows
export const TechRow = z.object({
  id: z.string(),
  tool: z.string().default(""),
  elaboration: z.string().default(""),
});
export type TechRow = z.infer<typeof TechRow>;

// --- Section 8.1 Security assessment (optional)
export const SecurityAssessment = z.object({
  required: z.boolean().default(false),
  iam: z.string().default(""),
  patch: z.string().default(""),
  network: z.string().default(""),
  configuration: z.string().default(""),
  loggingMonitoring: z.string().default(""),
  thirdPartyIntegrations: z.string().default(""),
});
export type SecurityAssessment = z.infer<typeof SecurityAssessment>;

// --- Section 9 Legal basis rows
export const LegalBasisRow = z.object({
  id: z.string(),
  processingPurpose: z.string().default(""),
  legalBasis: LegalBasis.default("consent"),
  applicable: z.boolean().default(false),
  description: z.string().default(""),
  specialCategoryData: z.string().default(""),
  exceptionDescription: z.string().default(""),
});
export type LegalBasisRow = z.infer<typeof LegalBasisRow>;

// --- Section 9.1 Compatible purpose
export const CompatiblePurposeRow = z.object({
  id: z.string(),
  processingActivity: z.string().default(""),
  personalData: z.string().default(""),
  originalPurpose: z.string().default(""),
  newPurpose: z.string().default(""),
  compatibilityExplanation: z.string().default(""),
});
export type CompatiblePurposeRow = z.infer<typeof CompatiblePurposeRow>;

// --- Section 10 Data subjects' rights
export const RightKey = z.enum(["access", "rectification", "restriction", "erasure", "portability", "object", "noAutomatedDecision"]);
export type RightKey = z.infer<typeof RightKey>;

export const RightRow = z.object({
  right: RightKey,
  consent: z.boolean().default(true),
  contract: z.boolean().default(true),
  legalObligation: z.boolean().default(true),
  vitalInterest: z.boolean().default(true),
  publicInterest: z.boolean().default(true),
  legitimateInterest: z.boolean().default(true),
  scientificResearch: z.boolean().default(true),
  explanation: z.string().default(""),
});
export type RightRow = z.infer<typeof RightRow>;

// --- Section 11/12
export const NecessitySchema = z.object({
  proportionality: z.string().default(""),
  subsidiarity: z.string().default(""),
});

// --- Section E Risk
export const RiskRow = z.object({
  id: z.string(),
  number: z.number().default(0),
  description: z.string().default(""),
  impact: Impact.default("negligible"),
  likelihood: Likelihood.default("negligible"),
  riskRating: RiskLevel.default("low"),
  treatment: RiskTreatment.default("acceptance"),
  treatmentDescription: z.string().default(""),
  residualImpact: Impact.default("negligible"),
  residualLikelihood: Likelihood.default("negligible"),
  residualRating: RiskLevel.default("low"),
  riskLevel: z.string().default(""),
  reviewDate: z.string().default(""),
  riskOwner: z.string().default(""),
});
export type RiskRow = z.infer<typeof RiskRow>;

// --- Consultation
export const ConsultationSchema = z.object({
  dpoAdvice: z.string().default(""),
  dpoDate: z.string().default(""),
  otherAdvice: z.string().default(""),
  otherDate: z.string().default(""),
});

// --- Full DPIA document
export const DpiaSchema = z.object({
  id: z.string(),
  projectName: z.string().default(""),
  organization: z.string().default("Eindhoven University of Technology"),
  status: Status.default("draft"),
  createdAt: z.string(),
  updatedAt: z.string(),
  people: PeopleSchema,
  versions: z.array(VersionEntry).default([]),

  // A — Description
  overviewOfProcessing: z.string().default(""),
  reasons: ReasonsSchema,
  dataSubjects: z.string().default(""),
  dataCollection: DataCollectionSchema,
  dataFlowRows: z.array(DataFlowRow).default([]),
  involvedParties: z.array(InvolvedParty).default([]),
  pbd: PbdStrategies,

  // B — Security
  techRows: z.array(TechRow).default([]),
  securityAssessment: SecurityAssessment,

  // C — Legal
  legalBasisRows: z.array(LegalBasisRow).default([]),
  compatiblePurposeRows: z.array(CompatiblePurposeRow).default([]),
  rights: z.array(RightRow).default([]),

  // D — Necessity
  necessity: NecessitySchema,

  // E — Risk
  riskRows: z.array(RiskRow).default([]),

  // Conclusion & Consultation
  conclusion: z.string().default(""),
  consultation: ConsultationSchema,
});
export type Dpia = z.infer<typeof DpiaSchema>;

export const DpiaMeta = z.object({
  id: z.string(),
  projectName: z.string(),
  status: Status,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type DpiaMeta = z.infer<typeof DpiaMeta>;

export const SECTION_IDS = [
  "cover",
  "s1-overview",
  "s2-reasons",
  "s3-data-subjects",
  "s4-data-collection",
  "s5-data-flow",
  "s5-diagram",
  "s6-parties",
  "s7-pbd",
  "s8-tech",
  "s8-security",
  "s9-legal-basis",
  "s9-compatible",
  "s10-rights",
  "s11-12-necessity",
  "e-risks",
  "conclusion",
  "consultation",
] as const;
export type SectionId = typeof SECTION_IDS[number];

export const SECTION_TITLES: Record<SectionId, string> = {
  "cover": "Cover page",
  "s1-overview": "1. Overview of the processing",
  "s2-reasons": "2. Reasons for the DPIA",
  "s3-data-subjects": "3. Data subjects",
  "s4-data-collection": "4. Data collection",
  "s5-data-flow": "5. Data flow table",
  "s5-diagram": "5.1 Data diagram",
  "s6-parties": "6. Involved parties",
  "s7-pbd": "7. Privacy by Design & by Default",
  "s8-tech": "8. Processing activity tech & method",
  "s8-security": "8.1 Security assessment",
  "s9-legal-basis": "9. Legal basis",
  "s9-compatible": "9.1 Compatible purpose",
  "s10-rights": "10. Data subjects' rights",
  "s11-12-necessity": "11/12. Necessity & proportionality",
  "e-risks": "E. Risk assessment & treatment",
  "conclusion": "Conclusion",
  "consultation": "Consultation",
};
