# stackshift
Unlock Your Web3 Potential with the Celo StackShift Program.

## What is it?

The Celo StackShift program is a unique initiative aimed at empowering developers to learn, grow, earn and innovate. The program is designed to help developers take their skills to the next level and build innovative solutions for the Celo ecosystem.

This eight-week program is designed to help developers become familiar with the Celo stack, including its infrastructure, tools, and libraries. Participants will work on projects that will be used by real users and contribute to the Celo ecosystem, making a meaningful impact on the platform.

## Why join Stackshift?
- Gain hands-on experience building on the Celo blockchain
- Be part of a vibrant community of developers and contribute to the growth of the Celo ecosystem
- Receive bounties (100 CUSD) weekly.
- Top three submissions get rewarded weekly.
- Learn about web3 development on Celo and stay ahead of the curve in the industry
- Networking opportunities and job placement assistance upon completion of the program
- Mentorship from industry experts to provide technical advice and career development

## Contributing to Stackshift

### General tips
- Before making the PR, run the code by yourself first to avoid any obvious errors and to make sure it works as expected.
- Provide pictures or screenshots to illustrate complicated processes where needed.
- Do not copy and paste existing content. Plagiarism is a serious issue and will not be tolerated. If the tutorial is inspired by some existing content (for example forking an Ethereum tutorial to convert it for use on Avalanche), reference it and link to it.
Add potential errors and troubleshooting. Of course, the tutorial shouldn't list all possible errors but make an effort to catch the important or most common ones.
- Include any walkthrough videos or video content in the PR by uploading it to Google Drive if needed.
- Display sample outputs to help learners know what to expect, in the form of Terminal snippets or screenshots. Trim long outputs.
- Take an error-driven approach where you bump into errors on purpose to teach learners how to debug them. For example, if you need to fund an account to be able to deploy a contract, first try and deploy without funding, observe the error that is returned, then fix the error (by funding the account) and try again.
- Funding of accounts from faucets needs to be explained clearly as to which account is being funded, from where and why. Do not assume learners can accomplish this on their own!

## How to structure your tutorial

- The Title should be direct and clear, summarizing the tutorial's goal. Do not add the tutorial title as a heading inside the document, use the markdown document filename. For example: If your tutorial was titled "Query Celo data with The Graph", the filename should be query-celo-data-with-the-graph.md
- Include an Introduction section explaining why this tutorial matters and what the context of the tutorial is. Don't assume that it is obvious.
Include a Prerequisites section explaining any prior knowledge required or any existing tutorials that need to be completed first, any tokens that are needed, etc.
- Include a Requirements section explaining any technology that needs to be installed prior to starting the tutorial and that the tutorial will not cover such as Metamask, Node.js, Truffle, HardHat, etc. Do not list packages that will be installed during the tutorial.
- Use subheadings (H2: ##) to break down your explanations within the body of the tutorial. Keep the Table of Contents in mind when using subheadings, and try to keep them on point.
- If the content below a subheading is short (for example, only a single paragraph and a code block), consider using bold text instead of a subheading.
- Include a Conclusion section that summarizes what was learned, reinforces key points and also congratulates the learner for completing the tutorial.
- Include a What's Next section pointing to good follow-up tutorials or other resources (projects, articles, etc.)
- Include an About This Participant section at the end.
- A References section must be present if you have taken any help in writing this tutorial from other documents, GitHub repos and other tutorials.

## Submitting your weekly task

### Submission Creation Process
- Move the Trello Card for your tutorial from Todo to In progress
- Follow the link in the Trello card to access the Google Doc where you’ll write your tutorial content
- Once you have completed your tutorial, move your Trello Card from In progress to Review and please wait as we review your tutorial and address any comments from your reviewer.


### How to Create a PR
- Fork the https://github.com/celo-org/stackshift.
- Create a branch name with syntax - stackshift/<tutorial-title>
- Create a PR from your branch to main branch. Make sure to add ?template=celo-sage-template at the end of the PR URL to get the template for the PR.

### Best Practices
- Before creating a PR, make sure to pull the code from main branch - git pull upstream main.
- Don't use any # tag in your article. Please use ## for titles, ### for subtitles.
- Don't use ** or *** in your titles or subtitles. Use ## or ### instead. ## and ### will automatically bold the text.
- Please run the prettier in your markdown file before creating a PR. You can use the prettier extension in VS Code or you can use the prettier online tool - Prettier Online.
- To use prettier in VSCode, you can press Cmd/Ctrl + shift + p and search for Format Document with and select Prettier - Code formatter.
- If the paragraph is too big, then please break it into multiple lines. It will help in reviewing the PR.
- Before creating a PR, make sure your code is well formatted and there are no errors in the console.


