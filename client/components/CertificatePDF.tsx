import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create exact styles for the A4 paper
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  // This is the magic flexbox that puts the title on the left and QR on the right
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #000',
    paddingBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a', // A deep blue to match standard inspection letterheads
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1px solid #eee',
    paddingVertical: 4,
  },
  label: {
    width: '40%',
    fontSize: 10,
    color: '#555',
  },
  value: {
    width: '60%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  }
});

// We accept both the form data AND the generated QR code image URL as props
export const CertificatePDF = ({ data, qrCodeUrl }: { data: any, qrCodeUrl: string }) => (
  <Document>
    
    {/* ================= PAGE 1: TEST CERTIFICATE ================= */}
    <Page size="A4" style={styles.page}>
      
      {/* The Header Row with Title and QR Code */}
      <View style={styles.titleRow}>
        <Text style={styles.header}>TEST CERTIFICATE</Text>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Certificate Number:</Text>
          <Text style={styles.value}>{data.certificateNumber || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipment Owner:</Text>
          <Text style={styles.value}>{data.equipmentOwner || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Equipment:</Text>
          <Text style={styles.value}>{data.equipmentName || 'N/A'}</Text>
        </View>
        {/* You can stack the rest of the Page 1 fields here... */}
      </View>

    </Page>

    {/* ================= PAGE 2: CALIBRATION CERTIFICATE ================= */}
    <Page size="A4" style={styles.page}>
      
      {/* The Header Row with Title and QR Code */}
      <View style={styles.titleRow}>
        <Text style={styles.header}>CALIBRATION CERTIFICATE</Text>
        {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{data.equipmentOwner || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service Request:</Text>
          <Text style={styles.value}>Calibration & Certification</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ambient Temp:</Text>
          <Text style={styles.value}>{data.ambientTemperature || 'N/A'}</Text>
        </View>
         {/* You can stack the rest of the Page 2 fields here... */}
      </View>

    </Page>

  </Document>
);