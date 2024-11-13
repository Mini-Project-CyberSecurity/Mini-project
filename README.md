# Kubernates Monitoring Using Monitoring Prometheus and Grafana
In today’s digital landscape, cloud computing has become the backbone of modern applications and data storage. However, with its growing adoption comes increasing concerns about security, particularly in ensuring the integrity, confidentiality, and availability of data stored on centralized cloud servers. Traditional cloud architectures often rely on single points of failure, making them vulnerable to breaches, data tampering, and unauthorized access.

Blockchain technology offers a revolutionary solution to these challenges by introducing decentralized, tamper-proof, and transparent systems. In a blockchain-enabled environment, data and processes are distributed across multiple nodes, eliminating reliance on a single entity and reducing the risks of centralized failures. The use of cryptographic techniques, consensus mechanisms, and immutable records provides a robust layer of security, ensuring data integrity and protecting sensitive information.

## Objective
The goal of this project is to overcome the challenges associated with centralized image storage and sharing by developing a **Decentralized Image Upload and Sharing System** using blockchain technology. The key issues addressed are:

- **Security Risks**:Centralized services are prone to data breaches and unauthorized access. Decentralizing storage with IPFS and using blockchain for access control ensures secure, tamper-resistant storage.

+ **Loss of User Control**: Traditional cloud services require users to trust third-party providers with their data. Our system gives users complete control over who can access their images through blockchain-based smart contracts.

- **Lack of Transparency**: Centralized platforms lack transparency. By using blockchain, all transactions related to image uploads and access control are verifiable, creating an immutable audit trail that fosters trust.

+ **Centralized Failures**: Reliance on a single server can result in outages. With IPFS and blockchain, the system is decentralized and resilient, ensuring continuous availability even in case of node failures.

This project provides a secure, transparent, and user-controlled alternative to traditional cloud-based storage solutions.

## Architecture
- **Blockchain Network**: Ethereum blockchain is used to deploy smart contracts developed in Solidity. The blockchain ensures decentralized management of image ownership and access control.
- **IPFS (InterPlanetary File System)**: Decentralized and immutable storage of images. Images are uploaded to IPFS, and their hash is stored on the blockchain.
- **Smart Contracts**: Implemented in Solidity to handle image ownership and permission management. Users can grant or revoke access to specific individuals.
- **Frontend**: Built using React for user interaction. Users can upload images and manage access controls through the interface.

![Screenshot 2024-07-30 133615](https://github.com/user-attachments/assets/38e60f65-95cd-4740-afb9-85798f28b36d)

## Functionality Overview:
- **Upload Image**: Users upload images through the React frontend. These images are stored on IPFS, and the corresponding hash is recorded on the blockchain.
- **Grant Access**: Image owners can specify users who are allowed access to view/download the image.
- **Revoke Access**: Owners can also revoke access at any point through the smart contract.
- **Immutable Records**: Every action is recorded on the Ethereum blockchain, ensuring transparency and security.

## Implementation
- **Solidity**: Smart contracts are developed to manage access control, ensuring only authorized users can access the images.
 **React**: The frontend is developed in React, where users can interact with the system to upload images and manage access.
- **IPFS**: Used to store images in a decentralized manner. Once uploaded, an IPFS hash is generated and stored in the blockchain.
- **Metamask Integration**: For interaction with the Ethereum blockchain, enabling users to connect their wallets and perform transactions.

## Key Features:
- **Decentralized Storage**: Images stored on IPFS ensure no central authority has control over them.
- **Smart Contract-Based Access Control**: Users can manage who has access to their images through Ethereum smart contracts.
- **Transparency**: Every action is recorded on the blockchain, providing a tamper-proof record of transactions.


## Technologies Used
- **Solidity**: For writing smart contracts that manage image ownership and access control.
- **React**: For building the frontend interface to allow users to upload images and manage permissions.
- **IPFS**: For decentralized image storage.
- **Metamask**: For blockchain wallet integration.



