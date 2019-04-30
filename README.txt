README.txt

Dave Hall and Richard Pates
4/29/2019
CS764
Semester Project

Contents:
The compressed file directory structure contains all source code, visual and text resources, and static files needed
to build and deploy the MedChain smart contract and application. The code does not include the library code, which
must be installed using 'npm install', with instructions below.

Pre-requisites:
The computer on which this is to run must have the following software installed. Details on installing and setting up
this software can be found in the introductory sections of the following webpage:
http://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial

Software:
    -Node.js and the npm package manager
    - Truffle Framework
    - Ganache (we recommend using the GUI version)
    - Metamask

Instructions:
1) Unpack the archive file into the desired root directory
2) type "npm install", press <enter>, and wait for the install to complete
3) Open the Ganache GUI
4) Click on "New Workspace"
5) Leave all defaults and select the "Accounts & Keys" tab
6) In the space next to "Enter the Mnemonic you wish to use." enter "sphere future jump off always sting stomach rubber coast just ugly coil"
7) Open MetaMask
8) Navigate to the localhost network at address "http://localhost:7545"
9) Click on the colorful circle and click import account
10) For the private key, click the key symbol on Ganache next to the account starting with "oxdCA...", copy and paste this
    into the form blank and submit
11) Repeat for the account starting with "oxF00f..."
12) On the command line, in the root directory, type "truffle migrate --reset"
13) type "npm run dev"
14) This will launch the webserver and, once running, will automatically open a browser window. The application
should run appropriately at this point.
