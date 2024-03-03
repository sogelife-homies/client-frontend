import OpenAI from "openai";
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import {database} from './Database.js';

const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true, //just for the POC...
});

const defaultRoles = [
    {
        role: "system",
        content: "Aggregates the individual KPI analyses to compute an overall Sustainability Score, represented as a percentage (0%-100%) and a corresponding emoji. It then generates a comprehensive summary that explains how this score was derived from the KPIs, including the impact and weighting of each KPI. The system ensures that the output is structured with two attributes: 'score', 'emoji' and 'summary'."
    },
    {
        role: "assistant",
        content: "Analyzes the provided JSON input containing sustainability KPIs, calculating a preliminary score for each KPI based on its performance relative to sustainability targets. It considers the importance (weighting) of each KPI in contributing to overall environmental sustainability. The assistant synthesizes this information into a detailed analysis."
    },

    // {
    //     role: "user",
    //     content: "As a conscientious investor through a life insurance company, you prioritize the sustainability impact of your investments. You understand that your premiums are funneled into stocks, bonds, and other assets with a sustainability focus. Your primary interest lies in assessing how these investments contribute to combating global warming and enhancing social welfare. You seek clarity on the environmental and social returns of your portfolio, alongside financial performance. This system helps you gauge the sustainability impact of your investments, providing you with a score and summary that detail the environmental and social outcomes driven by your investment choices."
    // }
]

export const processKPI = async () => {
    const resultObject = await readFromSmartContract();

    const content ="Calculate sustainability output in the strict stringifyed JSON format (attributes: score, summary, emoji) for the ESG KPI list. Score: 0%-100%, Emoji represents the score: 0% -saddest, 100% - happiest. Summary - 250 characters. The ESG KPI list: " + JSON.stringify(resultObject)
    const params = {
        messages: [
            ...defaultRoles,
            {role: "user", content},
        ],
        model: "gpt-4"
    }

    const chatCompletion = await openai.chat.completions.create(params)
    console.debug("chatCompletion.choices[0].message", chatCompletion.choices[0].message)
    return chatCompletion.choices[0].message.content;
}

const jsonRpcURL = 'https://node.ghostnet.etherlink.com/';
const web3 = new Web3(jsonRpcURL);

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "commitment",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      }
    ],
    "name": "addPrivateKPI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "addPublicKPI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      }
    ],
    "name": "getKPIKey",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      }
    ],
    "name": "getPrivateKPIStat",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      }
    ],
    "name": "getPublicKPI",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "company",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "kpiId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "vefifier",
        "type": "address"
      }
    ],
    "name": "setKPIVerfier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const contractAddress = '0xd6Ec7C42cC35B8419e398cFe29684baEAb0c2F9d';
const address = '0xE46DB4484E7eF0177Cc5e672d554DeDcEC0Bee3b';

const contract = new web3.eth.Contract(abi, contractAddress)

const readFromSmartContract = async () => {
    let resultObject = {};

    for (let i = 1; i <= 6; i++) {
      let test = await contract.methods.getPublicKPI(address, i).call();
      // Assuming test is returned as a BigInt (e.g., "1234n")
      // Convert BigInt to Number, ensuring it's within safe range
      test = Number(test); // Converts the BigInt to a Number

      const description = database[i.toString()]; // Convert i to string to match key
      resultObject[description] = test; // Now test is a simple number
    }

    console.log(resultObject);
    return resultObject;
};
