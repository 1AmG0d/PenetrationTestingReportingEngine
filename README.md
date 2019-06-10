![Logo](https://raw.githubusercontent.com/1AmG0d/PenetrationTestingReportingEngine/master/assets/icons/png/128x128.png)
# Penetration Testing Reporting Engine

Allows Penetration Testers To Quickly And Consistently Generate Penetration Testing Reports

- Please Note:
    - This Application Was Built For Personal Use
    - Modifications Will Most Likely Needed To Fit Your Needs

### Requirements
- Definitions
- Report Template (Docx)
- NodeJS (Development/Compilation)

### Dependencies
- docxtemplater
- electron
- jszip
- materialize-css

### Development Dependencies
- electron-packager

### Compilation
```sh
$ git clone https://github.com/1AmG0d/PenetrationTestingReportingEngine.git
$ cd PenetrationTestingReportingEngine
$ npm install -d
$ npm run package-<OS>
```
| package-<OS> |
| ------ |
| package-mac |
| package-win |
| package-linux |
| package-all |

- Builds Are Stored In The "release-builds" Directory

### Usage
- Copy Build Directory To Desired Location
- Launch Application
    -  You May Have To Modify Your AV To Allow The Application To Write To The User's Documents Directory
    - The Application Will Create The Following Directories/Files
        - ~/Documents/Configurations/Configuration.json
        - ~/Documents/Configurations/Definitions.json
        - ~/Documents/Reports/
        - ~/Documents/Templates/
- Click The "Menu" Button And Select "Configurations"
- Update Testers Initials (Appended To Final Report Name)
- Update Paths As Desired
- Select "Close" Button
- Close The Application (Required When Creating/Updating Definitions Or Report Template)
- Update Definitions (See Definition.json Section Below)
    - ~/Documents/Configurations/Definitions.json
- Add Docx Template To:
    - ~/Documents/Templates/
        - Must Be The Same Name As The Value Stored In The "Penetration Testing Report Template" Configuration Field
- Launch Application
- Click The "Menu" Button And Select "New Report"
- Fill Out All Fields (As Needed)
- Click "Create Report Button"
- Click "Generate Finding Report"

### Troubleshooting
- Developer Tools Are Still Enabled To Allow You To Debug
- Ensure AV Is Not Stopping The Application From Reading/Writing From Application Directory
    - Default: ~/Documents/PTRE

### Definitions.json
| Vulnerabilities Section | Example |
| ------ | ------ |
| Vulnerability | Stored XSS |
| Security Control | CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting') |
| Description | Stored Cross-site Scripting (XSS) is the most dangerous type of Cross Site Scripting. Web applications that allow users to store data are potentially exposed to this type of attack. This chapter illustrates examples of stored cross site scripting injection and related exploitation scenarios. Stored XSS occurs when a web application gathers input from a user which might be malicious, and then stores that input in a data store for later use. The input that is stored is not correctly filtered. As a consequence, the malicious data will appear to be part of the web site and run within the user’s browser under the privileges of the web application. Since this vulnerability typically involves at least two requests to the application, this may also called second-order XSS. Stored XSS does not need a malicious link to be exploited. A successful exploitation occurs when a user visits a page with a stored XSS. Stored XSS is particularly dangerous in application areas where users with high privileges have access. When the administrator visits the vulnerable page, the attack is automatically executed by their browser. This might expose sensitive information such as session authorization tokens.. |
| Recommended Action | Assume all input is malicious. Use an "accept known good" input validation strategy, i.e., use a whitelist of acceptable inputs that strictly conform to specifications. Reject any input that does not strictly conform to specifications, or transform it into something that does. |

##### Likelihood * Impact = Risk
| Levels Section | Example | Description |
| ------ | ------ | ------ |
| impact | [ "Low", "Moderate", "High" ] | A component of risk, likelihood describes the chance that a risk will be realized and the negative impact will occur. It is typically described in general terms like "low," "medium," and "high". Sometimes an actual probability is possible (e.g., the probability of two documents producing the same CRC-16 is approximately 1 in 65536). The likelihood of a technical risk is often related to the likelihood of a vulnerability being successfully exploited. This likelihood is often influenced by factors like how accessible the vulnerability is, the degree to which special tools need to be used to be successful, the amount of specialized knowledge an attacker needs, and so on. Likelihood is combined with impact to produce a severity estimate for a risk. |
| likelihood | [ "Low", "Moderate", "High" ] | A component of Risk, the impact describes the negative effect that results from a risk being realized. Example impacts include financial loss, legal and regulatory issues, brand and reputation damage, data loss, breach of contract, and so on. Impacts can be reduced as part of risk mitigation. For example, installing a second hard drive and configuring it as a RAID mirror of a primary hard drive reduces the impact of a disk failure. It does not address the likelihood of a disk failure at all. Impacts, like risks, can be technical or business related. For example, a technical impact could be corrupt data in the table storing a firm's outstanding orders. The business impact might be customer ill-will, increased customer service costs, and additional costs shipping and tracking replacement items. Some impacts can be contractually transferred to another party. Insurance, for example, can transfer the financial impact of a business risk to the insurer in exchange for a premium payment by the insured. The technical impact of a DDoS attack can be transferred to another entity by using their network and server resources. Not all impacts can be transferred. Brand and reputation damage, some legal and regulatory liability, and impacts on business qualities like time-to-market cannot be transferred. |
| overallRisk | [ "Informational", Low", "Moderate", "High", "Critical" ] | Risk is the possibility of a negative or undesirable occurrence. There are two independent parts of risk: Impact and Likelihood. To reduce risk, one can reduce the impact, reduce the likelihood, or both. Risk can also be accepted (meaning that the full impact of the negative outcome will be borne by the entity at risk). The impact and likelihood of a risk are usually combined to create an estimate of its Severity. |

### Template Parameters
| Parameter | Example | Usage |
| ------ | ------ | ------ |
| {applicationName} | Amazon | Used anywhere in the report where the Applications Name is needed. |
| {applicationURL} | https://www.amazon.com/ | Used anywhere in report where the Applications URL is needed. |
| {reportingDate} | Jan 01, 2020 | Used anywhere in report where the Date is needed. |
| {vulnImpact} | High | Used anywhere in report where the Vulnerability Impact is needed. |
| {vulnLikelihood} | Low | Used anywhere in report where the Vulnerability Likelihood is needed. |
| {overallRisk} | Moderate | Used anywhere in report where the Overall Risk is needed. |
| {vulnType} | Stored XSS | Used anywhere in report where the Vulnerability Type is needed. |
| {vulnDesc} | XXX | Used anywhere in report where the Vulnerability Description is needed. |
| {vulnSecControl} | XXX | Used anywhere in report where the Vulnerability Security Control is needed. |
| {vulnRecommendedFix} | XXX | Used anywhere in report where the Vulnerability Recommended Fix is needed. |
| {injParam} | k | Used anywhere in report where the Injectable Parameter is needed. |
| {payload} | <PAYLOAD> | Used anywhere in report where the Payload is needed. |
| {#steps}{.}{/steps} | Went To https://www.amazon.com/s?k=test | Used anywhere in report where the Steps are needed |
| | User Demonstrated XXX Vulnerability  | Note: This Is Needed Once. All Steps Are Replaced In This Location |
| {ifInjParam} | Via The "c" Parameter | Adds text to Injectable Parameter. Used in Title and Report Name. Note the character casing. |
| {ifInjParamDesc} | via the "k" parameter | Adds text to Injection Parameter. Used in summary/description section of report. Not the character casing.|
| {ifPayload} | using the following Payload: <PAYLOAD> | Adds text to Payload Parameter. Used in summary/description section of report |
| {ifUploads} | See embedded files for walkthrough: | Adds Text if Files are added. |

### To-Do
 - Possibly Implement Risk Calculator
    - https://www.security-net.biz/files/owaspriskcalc.html
 - Create Function To Generate Report If No Template Found
 - Save Report As PDF
 - Fix Embedding Images/Videos Into Generated Reports
 - Add More Parameters For Templates. Make It More Dynamic
 - Add Upload Parameter For Template (CURRENTLY NOT WORKING NEED TO FIX)
 - Create Example Template docx

License
----
MIT
