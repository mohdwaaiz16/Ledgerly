export const parseTransactions = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const results = {
    success: false,
    transactions: [],
    errors: []
  };

  if (!lines.length) {
    return results;
  }

  // Simple heuristic parser for: Date Particulars VoucherType VoucherNo Debit Credit
  // e.g. "10-Sep-26 By Canara Bank Receipt 100000"
  const dateRegex = /^(\d{1,2}-[a-zA-Z]{3}-\d{2,4})/;

  lines.forEach((line, index) => {
    try {
      const matchDate = line.match(dateRegex);
      if (!matchDate) {
        results.errors.push({
          lineNumber: index + 1,
          originalText: line,
          reason: 'Could not identify a valid date at the start of the line (e.g. 10-Sep-26)'
        });
        return;
      }

      const transaction_date = matchDate[1];
      const restOfLine = line.substring(transaction_date.length).trim();
      
      // Try to find the amounts at the end of the line
      // Amounts could be one or two numbers separated by space
      const parts = restOfLine.split(/\s+/);
      
      let debit = 0;
      let credit = 0;
      let amountIndex = parts.length;

      // Extract trailing numbers as amounts
      const num2 = parseFloat(parts[parts.length - 1]);
      if (!isNaN(num2)) {
        amountIndex--;
        const num1 = parseFloat(parts[parts.length - 2]);
        if (!isNaN(num1)) {
          // Found two numbers: debit and credit
          amountIndex--;
          debit = num1;
          credit = num2;
        } else {
          // Found one number. Usually, if it's a "Receipt", it might be credit? Or we can't tell easily without context.
          // For a simple parser, we'll put it in debit or credit based on keywords if possible, or just default to debit.
          // Or we can say if there's only one amount, it's debit if > 0, but that doesn't make sense.
          // For now, if "Receipt" is in the text, it's often a credit to the party? Let's check for 'Receipt' vs 'Payment'.
          if (line.toLowerCase().includes('receipt')) {
            credit = num2;
          } else {
            debit = num2;
          }
        }
      } else {
        results.errors.push({
          lineNumber: index + 1,
          originalText: line,
          reason: 'Could not identify valid numeric amounts at the end of the line'
        });
        return;
      }

      const textParts = parts.slice(0, amountIndex);
      
      // Try to extract voucher type and number from the end of textParts
      // e.g., "Receipt 100000", "Sales 53"
      let voucher_type = '';
      let voucher_number = '';
      
      if (textParts.length >= 2) {
        // Last part might be a voucher number if it's alphanumeric, previous might be voucher type
        // This is a naive approach
        voucher_number = textParts.pop() || '';
        voucher_type = textParts.pop() || '';
      }

      const particulars = textParts.join(' ').trim() || 'Imported Transaction';

      results.transactions.push({
        transaction_date,
        particulars,
        voucher_type,
        voucher_number,
        debit,
        credit,
        _originalLine: line,
        _lineNumber: index + 1
      });

    } catch (err) {
      results.errors.push({
        lineNumber: index + 1,
        originalText: line,
        reason: 'Unexpected error during parsing'
      });
    }
  });

  if (results.transactions.length > 0) {
    results.success = true;
  }

  return results;
};
