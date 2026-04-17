import { Document, Page, Text, View, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import type { Dpia } from "@/types/dpia";
import { RISK_COLOR } from "./riskScorer";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#0f172a" },
  cover: { justifyContent: "center", alignItems: "center" },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 8 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 14, marginBottom: 6, color: "#1e40af", borderBottom: "1px solid #cbd5e1", paddingBottom: 2 },
  h3: { fontSize: 11, fontWeight: 700, marginTop: 8, marginBottom: 4 },
  p: { marginBottom: 4, lineHeight: 1.4 },
  muted: { color: "#64748b", fontSize: 9 },
  kv: { flexDirection: "row", marginBottom: 2 },
  k: { width: 160, fontWeight: 700 },
  v: { flex: 1 },
  table: { borderTop: "1px solid #cbd5e1", borderLeft: "1px solid #cbd5e1" },
  tr: { flexDirection: "row" },
  th: { backgroundColor: "#e2e8f0", fontWeight: 700, padding: 4, borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1", fontSize: 9 },
  td: { padding: 4, borderRight: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1", fontSize: 9 },
  pill: { padding: 2, borderRadius: 4, color: "#fff", fontSize: 8, textAlign: "center" },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, color: "#94a3b8", fontSize: 8, textAlign: "center" },
});

function col(w: number) { return { width: `${w}%` } as any; }

const R: React.FC<{ children: React.ReactNode }> = ({ children }) => <View style={s.tr}>{children}</View>;

export function DpiaPdfDoc({ dpia, diagramPng }: { dpia: Dpia; diagramPng?: string | null }) {
  return (
    <Document title={`DPIA — ${dpia.projectName}`}>
      {/* Cover */}
      <Page size="A4" style={[s.page, s.cover]}>
        <Text style={s.muted}>Data Protection Impact Assessment</Text>
        <Text style={s.h1}>{dpia.projectName || "Untitled DPIA"}</Text>
        <Text style={s.muted}>{dpia.organization}</Text>
        <View style={{ marginTop: 24, width: "100%" }}>
          {Object.entries({
            "Department": dpia.people.department,
            "Data Domain Owner": dpia.people.dataDomainOwner,
            "Data Steward": dpia.people.dataSteward,
            "Data Protection Officer": dpia.people.dpo,
            "CISO": dpia.people.ciso,
            "Project Leader": dpia.people.projectLeader,
            "Privacy Officer": dpia.people.privacyOfficer,
            "Consulted Stakeholders": dpia.people.consultedStakeholders,
          }).map(([k, v]) => (
            <View style={s.kv} key={k}><Text style={s.k}>{k}</Text><Text style={s.v}>{v || "—"}</Text></View>
          ))}
          <View style={s.kv}><Text style={s.k}>Status</Text><Text style={s.v}>{dpia.status}</Text></View>
          <View style={s.kv}><Text style={s.k}>Created</Text><Text style={s.v}>{new Date(dpia.createdAt).toLocaleString()}</Text></View>
          <View style={s.kv}><Text style={s.k}>Last modified</Text><Text style={s.v}>{new Date(dpia.updatedAt).toLocaleString()}</Text></View>
        </View>
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* A. Description */}
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>A. Description of the processing</Text>
        <Text style={s.h3}>1. Overview of the processing</Text>
        <Text style={s.p}>{dpia.overviewOfProcessing || "—"}</Text>

        <Text style={s.h3}>2. Reasons for the DPIA</Text>
        {([
          ["High risk to rights and freedoms", dpia.reasons.highRisk],
          ["Listed by supervisory authority", dpia.reasons.listedByAuthority],
          ["Pre-DPIA indicated", dpia.reasons.preDpiaIndicated],
          ["Internal advice", dpia.reasons.internalAdvice],
          ["External advice", dpia.reasons.externalAdvice],
        ] as [string, boolean][]).map(([l, v]) => (<Text style={s.p} key={l}>{v ? "☒" : "☐"} {l}</Text>))}
        {dpia.reasons.listedBody && <Text style={s.muted}>Listed body: {dpia.reasons.listedBody}</Text>}
        {dpia.reasons.preDpiaCriteria && <Text style={s.muted}>Pre-DPIA criteria: {dpia.reasons.preDpiaCriteria}</Text>}

        <Text style={s.h3}>3. Data subjects</Text>
        <Text style={s.p}>{dpia.dataSubjects || "—"}</Text>

        <Text style={s.h3}>4. Data collection</Text>
        {([
          ["Previously collected by TU/e for other purposes", dpia.dataCollection.previouslyCollectedTuePurposeOther],
          ["Previously collected by TU/e for this purpose", dpia.dataCollection.previouslyCollectedTuePurposeSame],
          ["Previously collected by an external organization", dpia.dataCollection.previouslyCollectedExternal],
          ["New data collected only by TU/e", dpia.dataCollection.newCollectedTue],
          ["New data collected together with external collaborators", dpia.dataCollection.newCollectedWithExternal],
        ] as [string, boolean][]).map(([l, v]) => (<Text style={s.p} key={l}>{v ? "☒" : "☐"} {l}</Text>))}

        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Section 5: Data flow */}
      <Page size="A4" style={s.page}>
        <Text style={s.h3}>5. Data flow table</Text>
        <View style={s.table}>
          <R>
            {["Activity", "Purpose", "Data", "Type", "Subjects", "Source", "Storage", "Retention"].map((t, i) => (
              <Text style={[s.th, col([14, 12, 14, 8, 12, 12, 14, 14][i])]} key={t}>{t}</Text>
            ))}
          </R>
          {dpia.dataFlowRows.map(r => (
            <R key={r.id}>
              <Text style={[s.td, col(14)]}>{r.processingActivity}</Text>
              <Text style={[s.td, col(12)]}>{r.processingPurpose}</Text>
              <Text style={[s.td, col(14)]}>{r.personalDataItems || r.personalDataCategory}</Text>
              <Text style={[s.td, col(8)]}>{r.dataCategoryType}</Text>
              <Text style={[s.td, col(12)]}>{r.dataSubjects}</Text>
              <Text style={[s.td, col(12)]}>{r.source}</Text>
              <Text style={[s.td, col(14)]}>{r.storageLocation}</Text>
              <Text style={[s.td, col(14)]}>{r.retentionPeriod}</Text>
            </R>
          ))}
        </View>
        {diagramPng && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.h3}>5.1 Data diagram</Text>
            <Image src={diagramPng} style={{ width: "100%", maxHeight: 500 }} />
          </View>
        )}
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Section 6: Parties */}
      <Page size="A4" style={s.page}>
        <Text style={s.h3}>6. Involved parties</Text>
        <View style={s.table}>
          <R>
            {["Name", "Role", "Functions", "Interest", "Data", "Location", "DPA", "Transfer"].map((t, i) => (
              <Text style={[s.th, col([12, 12, 12, 14, 14, 10, 13, 13][i])]} key={t}>{t}</Text>
            ))}
          </R>
          {dpia.involvedParties.map(p => (
            <R key={p.id}>
              <Text style={[s.td, col(12)]}>{p.name}</Text>
              <Text style={[s.td, col(12)]}>{p.role}</Text>
              <Text style={[s.td, col(12)]}>{p.functions}</Text>
              <Text style={[s.td, col(14)]}>{p.interestDescription}</Text>
              <Text style={[s.td, col(14)]}>{p.dataCategory}</Text>
              <Text style={[s.td, col(10)]}>{p.location}</Text>
              <Text style={[s.td, col(13)]}>{p.dpa}</Text>
              <Text style={[s.td, col(13)]}>{p.transferMechanism}</Text>
            </R>
          ))}
        </View>

        <Text style={s.h3}>7. Privacy by Design & by Default</Text>
        {Object.entries(dpia.pbd).map(([k, v]) => (
          <View key={k} style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 700, fontSize: 9, textTransform: "capitalize" }}>{k}</Text>
            <Text style={s.p}>{v || "—"}</Text>
          </View>
        ))}
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Security */}
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>B. Security</Text>
        <Text style={s.h3}>8. Processing activity technology & method</Text>
        <View style={s.table}>
          <R>
            <Text style={[s.th, col(30)]}>Tool / method</Text>
            <Text style={[s.th, col(70)]}>Elaboration</Text>
          </R>
          {dpia.techRows.map(r => (
            <R key={r.id}>
              <Text style={[s.td, col(30)]}>{r.tool}</Text>
              <Text style={[s.td, col(70)]}>{r.elaboration}</Text>
            </R>
          ))}
        </View>
        {dpia.securityAssessment.required && (
          <>
            <Text style={s.h3}>8.1 Security assessment</Text>
            {Object.entries(dpia.securityAssessment).filter(([k]) => k !== "required").map(([k, v]) => (
              <View key={k} style={{ marginBottom: 3 }}>
                <Text style={{ fontWeight: 700, fontSize: 9 }}>{k}</Text>
                <Text style={s.p}>{String(v) || "—"}</Text>
              </View>
            ))}
          </>
        )}
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Legal & Necessity */}
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>C. Legal assessment</Text>
        <Text style={s.h3}>9. Legal basis</Text>
        <View style={s.table}>
          <R>
            <Text style={[s.th, col(25)]}>Purpose</Text>
            <Text style={[s.th, col(20)]}>Basis</Text>
            <Text style={[s.th, col(10)]}>Applicable</Text>
            <Text style={[s.th, col(25)]}>Description</Text>
            <Text style={[s.th, col(20)]}>Special data</Text>
          </R>
          {dpia.legalBasisRows.map(r => (
            <R key={r.id}>
              <Text style={[s.td, col(25)]}>{r.processingPurpose}</Text>
              <Text style={[s.td, col(20)]}>{r.legalBasis}</Text>
              <Text style={[s.td, col(10)]}>{r.applicable ? "☒" : "☐"}</Text>
              <Text style={[s.td, col(25)]}>{r.description}</Text>
              <Text style={[s.td, col(20)]}>{r.specialCategoryData}</Text>
            </R>
          ))}
        </View>

        <Text style={s.h3}>10. Data subjects' rights</Text>
        {dpia.rights.map(r => (<Text style={s.p} key={r.right}><Text style={{ fontWeight: 700 }}>{r.right}:</Text> {r.explanation || "—"}</Text>))}

        <Text style={s.h2}>D. Necessity & proportionality</Text>
        <Text style={s.h3}>11. Proportionality</Text>
        <Text style={s.p}>{dpia.necessity.proportionality || "—"}</Text>
        <Text style={s.h3}>12. Subsidiarity</Text>
        <Text style={s.p}>{dpia.necessity.subsidiarity || "—"}</Text>
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Risks */}
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>E. Risk assessment & treatment</Text>
        <View style={s.table}>
          <R>
            <Text style={[s.th, col(4)]}>#</Text>
            <Text style={[s.th, col(34)]}>Description</Text>
            <Text style={[s.th, col(10)]}>Rating</Text>
            <Text style={[s.th, col(12)]}>Treatment</Text>
            <Text style={[s.th, col(22)]}>Treatment detail</Text>
            <Text style={[s.th, col(9)]}>Residual</Text>
            <Text style={[s.th, col(9)]}>Review</Text>
          </R>
          {dpia.riskRows.map(r => (
            <R key={r.id}>
              <Text style={[s.td, col(4)]}>{r.number}</Text>
              <Text style={[s.td, col(34)]}>{r.description}</Text>
              <Text style={[s.td, col(10), s.pill, { backgroundColor: RISK_COLOR[r.riskRating] }]}>{r.riskRating}</Text>
              <Text style={[s.td, col(12)]}>{r.treatment}</Text>
              <Text style={[s.td, col(22)]}>{r.treatmentDescription}</Text>
              <Text style={[s.td, col(9), s.pill, { backgroundColor: RISK_COLOR[r.residualRating] }]}>{r.residualRating}</Text>
              <Text style={[s.td, col(9)]}>{r.reviewDate}</Text>
            </R>
          ))}
        </View>

        <Text style={s.h2}>Conclusion</Text>
        <Text style={s.p}>{dpia.conclusion || "—"}</Text>

        <Text style={s.h2}>Consultation</Text>
        <Text style={s.h3}>DPO advice</Text>
        <Text style={s.muted}>Date: {dpia.consultation.dpoDate || "—"}</Text>
        <Text style={s.p}>{dpia.consultation.dpoAdvice || "—"}</Text>
        <Text style={s.h3}>Other advice</Text>
        <Text style={s.muted}>Date: {dpia.consultation.otherDate || "—"}</Text>
        <Text style={s.p}>{dpia.consultation.otherAdvice || "—"}</Text>

        <Text style={{ marginTop: 24 }} />
        <View style={s.kv}><Text style={s.k}>Signature (DPO):</Text><Text style={s.v}>_________________________________</Text></View>
        <View style={s.kv}><Text style={s.k}>Signature (Controller):</Text><Text style={s.v}>_________________________________</Text></View>
        <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}

export async function downloadPdf(dpia: Dpia, diagramPng?: string | null) {
  const blob = await pdf(<DpiaPdfDoc dpia={dpia} diagramPng={diagramPng} />).toBlob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `DPIA_${(dpia.projectName || "untitled").replace(/[^\w-]+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
}
