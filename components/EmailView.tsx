import { Html } from "@react-email/html";
import { Body } from "@react-email/body";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Row } from "@react-email/row";
import { Column } from "@react-email/column";
import { Head } from "@react-email/head";
import { Container } from "@react-email/container";

interface EmailType {
    subject: string,
    text: string,
    from: {
        text: string
    }
    to: {
        text: string
    },
    html: string
}

function EmailView({ email } : {email: EmailType}) {
  return (
    <div>
      <Head>
        <title>{email.subject}</title>
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section>
            <Text style={subjectStyle}>{email.subject}</Text>
            <Row>
              <Column>
                <Text style={metaText}>📩 From: {email.from.text}</Text>
                <Text style={metaText}>📨 To: {email.to.text}</Text>
              </Column>
            </Row>
            <hr />
            <Section>
              <Text style={emailContentStyle}> {email.text || "No text content available"} </Text>
              {/* Display HTML content safely */}
              {email.html && (
                <div dangerouslySetInnerHTML={{ __html: email.html }} style={emailContentStyle} />
              )}
            </Section>
          </Section>
        </Container>
      </Body>
    </div>
  );
}

const bodyStyle = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const containerStyle = { maxWidth: "600px", margin: "auto", padding: "20px", backgroundColor: "#fff" };
const subjectStyle = { fontSize: "20px", fontWeight: "bold", color: "#333" };
const metaText = { fontSize: "14px", color: "#555" };
const emailContentStyle = { fontSize: "16px", color: "#222", marginTop: "10px" };

export default EmailView;
