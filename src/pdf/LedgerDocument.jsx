import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { styles } from './ledgerPdfStyles';
import { calculateTotalDebit, calculateTotalCredit, calculateBalance, getBalanceDirection, formatCurrency, formatCurrencyWithDirection } from '../utils/ledgerCalculations';

// Utility to format date for display in PDF (DD-MM-YYYY)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const LedgerDocument = ({ company, ledger, transactions }) => {
  const totalDebit = calculateTotalDebit(transactions);
  const totalCredit = calculateTotalCredit(transactions);
  const balance = calculateBalance(transactions, ledger);
  const balanceDirection = getBalanceDirection(balance, ledger);
  
  const formattedOpening = formatCurrencyWithDirection(
    ledger?.opening_balance || 0,
    ledger?.opening_balance_type === 'Credit' ? 'Cr' : 'Dr'
  );
  
  const formattedClosing = formatCurrencyWithDirection(balance, balanceDirection);

  const getPeriodText = () => {
    if (ledger?.from_date && ledger?.to_date) {
      return `${formatDate(ledger.from_date)} to ${formatDate(ledger.to_date)}`;
    } else if (ledger?.from_date) {
      return `From ${formatDate(ledger.from_date)}`;
    } else if (ledger?.to_date) {
      return `Until ${formatDate(ledger.to_date)}`;
    } else {
      return 'All time';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer} fixed>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company?.company_name || 'Company Name'}</Text>
            {company?.address && <Text style={styles.companyDetails}>{company.address}</Text>}
            {company?.email && <Text style={styles.companyDetails}>Email: {company.email}</Text>}
            {company?.phone && <Text style={styles.companyDetails}>Phone: {company.phone}</Text>}
            {company?.gst_number && <Text style={styles.companyDetails}>GSTIN: {company.gst_number}</Text>}
            {company?.pan && <Text style={styles.companyDetails}>PAN: {company.pan}</Text>}
          </View>
          <View style={styles.ledgerInfo}>
            <Text style={styles.ledgerTitle}>{ledger?.ledger_name || 'Ledger'}</Text>
            <Text style={styles.ledgerDates}>
              {ledger?.ledger_type || 'General'} Ledger
            </Text>
            {ledger?.account_reference && <Text style={styles.ledgerDates}>A/c Ref: {ledger.account_reference}</Text>}
            <Text style={styles.ledgerDates}>
              Period: {getPeriodText()}
            </Text>
            <Text style={styles.ledgerDates}>Opening Bal: {formattedOpening}</Text>
          </View>
        </View>

        {/* Transaction Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow} fixed>
            <View style={styles.tableColDate}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColParticulars}>
              <Text style={styles.tableCellHeader}>Particulars</Text>
            </View>
            <View style={styles.tableColVchType}>
              <Text style={styles.tableCellHeader}>Vch Type</Text>
            </View>
            <View style={styles.tableColVchNo}>
              <Text style={styles.tableCellHeader}>Vch No.</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCellHeaderRight}>Debit</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCellHeaderRight}>Credit</Text>
            </View>
          </View>

          {/* Table Rows */}
          {transactions && transactions.length > 0 ? (
            transactions.map((t, index) => (
              <View style={styles.tableRow} key={t.id || index} wrap={false}>
                <View style={styles.tableColDate}>
                  <Text style={styles.tableCell}>{formatDate(t.transaction_date)}</Text>
                </View>
                <View style={styles.tableColParticulars}>
                  <Text style={styles.tableCell}>{t.particulars}</Text>
                </View>
                <View style={styles.tableColVchType}>
                  <Text style={styles.tableCell}>{t.voucher_type}</Text>
                </View>
                <View style={styles.tableColVchNo}>
                  <Text style={styles.tableCell}>{t.voucher_number}</Text>
                </View>
                <View style={styles.tableColAmount}>
                  <Text style={styles.tableCellRight}>{t.debit > 0 ? formatCurrency(t.debit) : ''}</Text>
                </View>
                <View style={styles.tableColAmount}>
                  <Text style={styles.tableCellRight}>{t.credit > 0 ? formatCurrency(t.credit) : ''}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text>No transactions recorded for this period.</Text>
            </View>
          )}

          {/* Totals Rows */}
          <View style={styles.totalsRow} wrap={false}>
            <View style={styles.totalsLabel}>
              <Text>Totals</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCellHeaderRight}>{formatCurrency(totalDebit)}</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCellHeaderRight}>{formatCurrency(totalCredit)}</Text>
            </View>
          </View>
          
          <View style={styles.balanceRow} wrap={false}>
            <View style={styles.totalsLabel}>
              <Text>Closing Balance</Text>
            </View>
            <View style={[{ width: '30%', borderStyle: 'solid', borderWidth: 1, borderColor: '#EEEEEE', borderLeftWidth: 0, borderTopWidth: 0 }]}>
              <Text style={[styles.tableCellHeaderRight, { color: balanceDirection === 'Cr' ? '#DC2626' : '#3D2314' }]}>
                {formattedClosing}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages} - Generated by Ledgerly`
          )} />
        </View>
      </Page>
    </Document>
  );
};
