## Core concepts

**Fundamental concepts of Bazar and the permaweb.**

### Atomic asset

Atomic Assets are unique digital items stored on the permaweb, designed to simplify the ownership and transfer of digital assets while ensuring security and permanence. Unlike traditional NFTs, the data of an atomic asset—its metadata and smart contract—are uploaded together in a single, inseparable transaction. This eliminates reliance on external components, unlike other blockchains where these elements are often stored separately and linked by the smart contract.

Atomic Assets can represent anything from art, music, and videos to applications, domain names, or memberships. Read the full atomic asset specification [here](https://github.com/permaweb/permaweb-libs/blob/main/specs/spec-atomic-assets.md).

![Atomic Asset Collection](https://arweave.net/7kIS7I0DYscZpwhOAm75h39qqXEGQYOnbpfpH7HCSiw)

### Atomic asset collection

Atomic asset collections are groups of atomic assets bundled together and displayed as a collection on the UCM. These collections can consist of existing atomic assets owned by the user, newly uploaded assets, or a combination of both. Read the atomic asset collection specification [here](https://github.com/permaweb/permaweb-libs/blob/main/specs/spec-collections.md).

![Atomic Asset Collection](https://arweave.net/bZn3OwpPCTPV6CPsrobvGvXFyF_vdwkrtj7JaK_F5fM)

### Ardrive Turbo

[Ardrive Turbo](https://ardrive.io/turbo-bundler/) is a payment service that bridges fiat currency to $AR and bundles data into larger, more efficient uploads to the Arweave network. Turbo credits are purchased with fiat currency through a Stripe integration.

All uploads to the permaweb via Bazar Studio is done with Turbo credits. Support for uploads with $AR are under development.

### Universal Data License (UDL)

The Universal Data License defines the terms and conditions for using media assets on the permaweb. The UDL establishes a framework for licensing digital media such as images, videos, audio, graphics and more.

Instead of platforms setting the terms and conditions, on the permaweb creators define how their media can be utilized. Learn how you can attatch UDL tags to your Bazar uploads [here](https://studio_bazar.arweave.net//#/docs/attach-udl) and read the full UDL [here](https://orgsxgbx4x37hfuoidzzzuixdwsi57e2eetei2ew6mzwqkxikhoa.arweave.net/dE0rmDfl9_OWjkDznNEXHaSO_JohJkRolvMzaCroUdw).

![UDL](https://arweave.net/TDH835b0UCD0B8h8CRqPalmVCw2J_9Fp_s0UNOsa8pY)

### Universal Content Marketplace (UCM)

The **Universal Content Marketplace (UCM)** is a protocol on the permaweb designed to enable the **trustless exchange of atomic assets**. It empowers creators and users to trade and transact with digital content, ranging from images and music to videos, papers, components, and even applications.

#### How it works

The UCM functions by accepting a deposit from a buyer or seller and fulfilling orders based on the swap pair, quantity, and possibly price that are passed along with the deposit. UCM allows creators and users to trade and transact with any form of digital content. Here is a list of actions that take place to complete a UCM order.

1. A user deposits (transfers) their tokens to the UCM. The user will also have to add additional tags to the **Transfer Message** which are forwarded to the UCM process and will be used to create the order.
2. The token process issues a **Credit-Notice** to the UCM and a **Debit-Notice** to the user.
3. The UCM **Credit-Notice Handler** determines if the required tags are present in order to create the order.
4. The UCM uses the forwarded tags passed to the **Transfer Handler** to submit an order to the orderbook. The order creation input includes the swap pair to execute on, as well as the quantity of tokens and price of tokens if the order is a limit order.

**See the UCM source code [here](https://github.com/permaweb/ao-ucm).**

#### Core Functionality

- **Powered by AO**: The UCM runs on AO, a hyper-parallel computing system built on the Arweave network. AO offers a unified environment for executing decentralized applications and processes.

- **Trustless Transactions**: UCM eliminates the need for third-party intermediaries in transactions.
- **Licensable Data**: The [Universal Data License](https://udlicense.arweave.net/) (UDL) ensures that value flows equitably to creators and contributors on the permaweb. This standard framework allows creators to set their own terms for the usage of content they upload. Learn more about UDL [here](https://bazar.arweave.net/#/docs/creators/universal-data-license).
- **Earn $PIXL Rewards**: The UCM protocol rewards users with PIXL tokens for maintaining a buying streak. The longer the streak, the larger the daily PIXL rewards! Learn more about earning PIXL [here](https://bazar.arweave.net/#/docs/collectors/earn-pixl).

#### UCM Fees

The UCM captures a **0.5% fee** per transaction. If the trade involves $wAR tokens, the fee is used to purchase PIXL tokens as follows:

1. The contract buys available PIXL sell orders.
2. If no sell orders exist, it initiates a “Buy” order through a **reverse Dutch auction**.
3. PIXL tokens purchased through this process are **burned**, reducing the overall supply

Higher trading volumes and fees result in more tokens being purchased and burned, increasing PIXL scarcity. See the PIXL tokenomics [here](https://bazar.arweave.net/#/docs/collectors/earn-pixl)
