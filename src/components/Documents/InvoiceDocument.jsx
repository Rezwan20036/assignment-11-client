import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#E4E4E4', padding: 20 },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontWeight: 'bold' },
});

const InvoiceDocument = ({ payment }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>InfraReport Invoice</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Transaction ID:</Text>
                    <Text>{payment.transactionId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text>{new Date(payment.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text>৳{payment.amount}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Type:</Text>
                    <Text>{payment.type}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Payer:</Text>
                    <Text>{payment.userName}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default InvoiceDocument;
