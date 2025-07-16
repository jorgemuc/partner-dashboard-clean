export const paramOptions = {
  'Heizkostenabrechnung': [{format:'CSV', transport:'Portal'}],
  'Unterjährige Verbrauchsinformation': [
    {format:'XML', transport:'bved Consumption Service'},
    {format:'XML', transport:'Aareon EED'}
  ],
  'Unterjährige Nutzerwechsel': [
    {format:'JSON', transport:'bved On-Site-Roles'},
    {format:'JSON', transport:'Aareon Stammdaten'}
  ],
  'Elektronischer Rechnungsservice': [
    {format:'PDF', transport:'Email'},
    {format:'EDI', transport:'FTP'}
  ],
  'Zwischenablesung': [{format:'JSON', transport:'REST'}]
};
