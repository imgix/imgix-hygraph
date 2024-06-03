# Hygraph Imgix App

## Known limitations

> [!WARNING]  
> These are known limitations due to the way Hygraph/our app works. Please read these carefully before using this app.

- If you replace an asset's file in Hygraph, it will not update and show the old version instead. Please delete the asset completely and create a new one if you want to change the displayed image.

- Sometimes fields might be clipped due to a bug in Hygraph. The button to add or change assets might not be visible then. Please refresh the page to resolve the issue. If the issue still persists after a refresh report this bug to Imgix.

## Installation

This app can be installed in your Hygraph project from the Hygraph Marketplace.

<!-- TODO: update marketplace link after publishing the app to the marketplace -->

[Install Hygraph App](https://hygraph.com/marketplace/apps/hygraph-imgix-plugin)

## Configuration

To use this app, you will need to create an imgix source, either a Web Folder type source to use your Hygraph assets or any other source types to use assets hosted outside of Hygraph.

### Using assets from Hygraph

#### Step 1 - Configuring the imgix source

1. Create a new imgix source, selecting "Web Folder" as a Storage Type.

2. Now enter the base URL for your imgix source. To obtain the URL, go to the "Assets" tab in the Hygraph app and right click any asset thumbnail, then select "Copy Image Address". Keep the part before `/output=...` and delete the rest.

   **Example**

   If your copied URL is `https://eu-central-1-shared-euc1-02.graphassets.com/clv45iyzm039407umd5w7aemt/output=format:jpg/resize=width:59,height:59,fit:crop/clw6dt8hndhuu07w6tcaqt9h3` you should use `https://eu-central-1-shared-euc1-02.graphassets.com/clv45iyzm039407umd5w7aemt` as the base URL.

3. Use the default imgix subdomain or configure your own and press "Deploy Source".

For more detailed instructions on configuring the Web Folder source, please refer to the [imgix documentation](https://docs.imgix.com/setup/creating-sources/web-folder).

#### Step 2 - Configuring the Hygraph app

1. Select the "Webfolder" source type in the Hygraph app configuration - this should be the default value.

2. In the source URL field, enter your imgix source domain, prefixed with `https://`. For example: `https://my-assets.imgix.net` if you used `my-assets` during the creation of your imgix source.

3. Press "Save config" to save the configuration.

### Using assets from outside of Hygraph

#### Step 1 - Configuring the imgix source

Please refer to the [imgix documentation](https://docs.imgix.com/setup/creating-sources) for instructions on configuring your imgix source.

#### Step 2 - Configuring the Hygraph app

1. Select the "Other" source type in the Hygraph app configuration.

2. In the source URL field, enter your imgix source domain, prefixed with `https://`. For example: `https://my-assets.imgix.net` if you used `my-assets` during the creation of your imgix source.

3. Obtain a new imgix API key. You can create it using the dropdown menu in the top right corner of the imgix dashboard, then pressing "API Keys" and "Generate new key". The permission that is necessary for the app to access your assets is "Asset Manager Browse".

4. Put the API key in the "API Key" field.

5. Put your Source ID in the "Source ID" field. It can be obtained from the imgix dashboard.

6. Press "Save config" to save the configuration.

## Using your assets in Hygraph

1. In your Hygraph Model search for the "Imgix Field" field type and add it to your model.

2. After adding the field, you can use it like a regular "Asset picker" field.
