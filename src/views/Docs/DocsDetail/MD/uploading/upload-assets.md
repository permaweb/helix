## Upload single atomic assets

- Select the "**Atomic Assets**" tab on the top right of the upload page.
- Click **Select files to upload** and select the assets that you would like to upload.
- Under **Actions** you can select **Edit title** and **Edit description** for each asset to be uploaded.
  Under the list of assets, the upload cost in Turbo Credits will be displayed.

#### Asset details

**Fractional vs single asset ownership**

- You have the ability to determine if your atomic assets can be owned only by one person or if the ownership can be fractionalized.
- For single ownership, do not check the box next to **“These assets will use fractionalized tokens”**.
- To allow fractional ownership check off the box next to **“These assets will use fractionalized tokens”**.
- In the field below determine how many fractional tokens are allowed for each of your atomic assets.

**Asset topics**

- Select topics that best describe your atomic assets. Add as many custom topics as needed. These topics assist in discoverability on the permaweb. Learn more about asset discoverability tags (ANS-110) [here](https://specs.g8way.io/#/view/SYHBhGAmBo6fgAkINNoRtumOzxNB8-JFv2tPhBuNk5c).

**Renderers**
Render-With tags are used to specifiy a default way for an atomic asset to be rendered. Atomic assets may have metadata information which may be lost if the media is shared pre-rendered by applications built on top of Arweave. A standard way to specify a rendering application for such data allows directly sharing the Transaction ID of the raw data asset (which is atomically linked to its associated Metadata) and have it be rendered/experienced in the way it was meant to be viewed. Read more about [ANS-108: Render-With](https://specs.arweave.net/?tx=rF3z0U1rsUJyJLhKGzigoPZPuxuHn3HRT80SZdGQBd4).

#### Attach a license to your atomic assets

After uploading your atomic assets and configuring metadata you will proceed to the next screen to attach licensing rights to your work with the Universal Data License.

To upload an atomic asset without attaching a license, uncheck the box next to **"This asset will contain a license"**.

#### What is the Universal Data License (UDL)?

The Universal Data License defines the terms and conditions for using media assets on the permaweb. The UDL establishes a framework for licensing digital media such as images, videos, audio, graphics and more. Instead of platforms setting the terms and conditions, on the permaweb creators define how their media can be utilized. Link to the full UDL [here](https://orgsxgbx4x37hfuoidzzzuixdwsi57e2eetei2ew6mzwqkxikhoa.arweave.net/dE0rmDfl9_OWjkDznNEXHaSO_JohJkRolvMzaCroUdw).

Since platforms built on the Universal Content Marketplace (UCM) protocol are in their "early" release, not all UDL parameters are currently supported. Please check with the marketplace platforms for more information about how UDL is supported on their platform.

#### UDL early release

Since UDL is in its "early" release, not all UDL parameters are currently supported on Bazar. Stay tuned for more updates related to UDL capabilites on Bazar and other permaweb applications.

Read the UDL v.02 release blog post [here](https://mirror.xyz/0x64eA438bd2784F2C52a9095Ec0F6158f847182d9/RPzz5-8jh_eWCdqn-K51DIkk5i_gQTTmRAwdvm7OihI).

#### UDL parameters

- Access Fee - Fee a user must pay to access the content
  - One time - Pay once to access content forever.
- Derivations - Allow or disallow other creators to derive media based on your work. Derivative works are works that alters, adapts, amends, transforms or adjusts the original work.
  - With credit - The Licensee must credit and link to the original work.
  - With indication - The Licensee must indicate that their work is a derivative work.
  - With License Passthrough - Licensee shall only allow the use of a Derivation to third parties under the same terms and conditions as under the original license.
  - With Revenue Share - the Licensee shall pay the stated percentage to the Licensor from the revenue received from third parties for the derivative work.
  - With Monthly Fee - The Licensee must pay the Licensor a monthly fee to continue using the derivative work.
  - With One-Time Fee - The Licensee must pay the Licensor a one time fee before creating a derivative work.
- Commercial Use - Allow or disallow the use of the content for commercial use. Commercial use refers to using the media for anything other than personal and non-commercial purposes. This includes any use that aims to make money or gain some form of commercial benefit.
  - With Revenue Share - the Licensee shall pay the stated percentage to the Licensor from the revenue received from third parties for the commercial use Media.
  - With Monthly Fee - The Licensee must pay the Licensor a monthly fee to continue using the commercial use Media.
  - With One-Time Fee - The Licensee must pay the Licensor a one time fee to use the commercial-use Media.
- Data Model Training - Allow or disallow the reproduction and use of your content for data model training.
  - With Monthly Fee - The Licensee must pay the Licensor a monthly fee to continue using the Media for data model training.
  - With One-Time Fee - The Licensee must pay the Licensor a one time fee to use the Media for data model training.
- Payment Mode - The wallet address in which UDL payments are to be made to.
  - Single - All payments go to the indicated address
  - Random - Payments are distributed randomly between wallet addresses proportional to their respective holdings of the asset.
  - Global - Payments are distributed evenly between wallet addresses proportional to their respective holdings of the asset.
