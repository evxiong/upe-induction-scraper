# UPE Induction Requirement Web Scraper

Quick and dirty scraper that will retrieve and sort inductees' test upload and resume upload status from [upe.seas.ucla.edu](https://upe.seas.ucla.edu). It writes the retrieved data to a TSV file, whose contents can be copied and pasted into the private requirement tracker spreadsheet. Your UPE account must have sufficient website access for this scraper to work.

## How to Use

1. Clone this repo
2. Run `npm install`
3. Copy `.env.template` to a new file called `.env` and fill in your username and password.
4. Run `node index.js`
5. Copy and paste the contents of `uploads.tsv` into the designated location in the private tracker spreadsheet.
6. Manually check off changes in the Master tab.


## Example Output

Columns are separated by one tab.

```uploads.tsv
Name    Email (from website)	Upload Tests (3)	Upload Resume
John Doe    jdoe@g.ucla.edu true	true
Jane Doe	jadoe@g.ucla.edu	true	false
```

## Notes

Currently, this scraper has not been integrated into Google Cloud Functions due to differences in emails and names in the tracker spreadsheet and on the website. Inductees have the ability to change their name and email on the website; therefore, this should not be fully automated.