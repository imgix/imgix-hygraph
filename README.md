# Hygraph Imgix App
Connect your Hygraph project to imgix

## What you can do with the Hygraph-imgix integration

With the imgix app, you can use imgix to serve assets from your Hygraph project. You can also use other imgix sources and add them to your content.

## Prerequisites to use this integration

- You must have a Hygraph account. If you don't have one, you can create one [here](https://app.hygraph.com/signup).
- You must have a [Hygraph project](https://hygraph.com/docs/getting-started/create-a-project) with at least one [model](https://hygraph.com/docs/getting-started/create-a-model).
- You must have a imgix account. If you don't have one yet, you can create one [here](https://dashboard.imgix.com/sign-up).


> [!WARNING]
> Apps are environment specific. This means their configuration is applied per environment. Take this into consideration if you're working with a project using more than one environment.

## Install the imgix app

<!-- TODO: update marketplace link after publishing the app to the marketplace -->

[Click here](https://hygraph.com/marketplace/apps/hygraph-imgix-plugin) to install the imgix app, then follow the setup instructions below.

## Configuration

To use this app, you will need to [create an imgix source](https://docs.imgix.com/getting-started/setup/creating-sources), either a Web Folder source type, to use your Hygraph assets, or any other source types to use assets hosted outside of Hygraph.

### Using assets from Hygraph

#### Step 1 - Configuring the imgix source

1. Create a new imgix source, selecting **Web Folder** as a Storage Type. Refer to [this page](https://docs.imgix.com/getting-started/setup/creating-sources/web-folder) for more details about the Web Folder source.

2. Now enter the base URL for your imgix source. If your Hygraph project is using the [Legacy asset system](https://hygraph.com/docs/api-reference/assets/assets-overview#which-asset-system-does-my-project-use), you will need to use `https://media.graphassets.com/` as the base URL. If you are not using the Legacy asset system, follow the instructions below to obtain the URL.

3. To obtain the URL, go to the **Assets** tab in the Hygraph app and right click any asset thumbnail, then select `Copy Image Address`. Keep the part before `/output=...` and delete the rest.

   **Example**

   If your copied URL is `https://eu-central-1-shared-euc1-02.graphassets.com/clv45iyzm039407umd5w7aemt/output=format:jpg/resize=width:59,height:59,fit:crop/clw6dt8hndhuu07w6tcaqt9h3` you should use `https://eu-central-1-shared-euc1-02.graphassets.com/clv45iyzm039407umd5w7aemt` as the base URL.

4. Use the default imgix subdomain or configure your own and press the `Deploy Source` button.

For more detailed instructions on configuring the Web Folder source, please refer to the [imgix documentation](https://docs.imgix.com/getting-started/setup/creating-sources/web-folder).

#### Step 2 - Configuring the Hygraph app

1. Select the **Webfolder** source type in the Hygraph app configuration - this should be the default value.

2. In the source URL field, enter your imgix source domain, prefixed with `https://`. For example: `https://my-assets.imgix.net` if you used `my-assets` during the creation of your imgix source.

3. Press `Save config` to save the configuration.

### Using assets from outside of Hygraph

#### Step 1 - Configuring the imgix source

Please refer to the [imgix documentation](https://docs.imgix.com/getting-started/setup/creating-sources) for instructions on configuring your imgix source.

#### Step 2 - Configuring the Hygraph app

1. Select the **Other** source type in the Hygraph app configuration.

2. In the source URL field, enter your imgix source domain, prefixed with `https://`. For example: `https://my-assets.imgix.net` if you used `my-assets` during the creation of your imgix source.

3. Obtain a new imgix API key. You can create it using the dropdown menu in the top right corner of the imgix dashboard, then goint to **API Keys** and press the `Generate new key` button. The permission that is necessary for the app to access your assets is "Asset Manager Browse".

4. Put the API key in the `API Key` field.

5. Put your Source ID in the `Source ID` field. It can be obtained from the imgix dashboard. Go to **Sources**, then press `View` on the appropriate source and the source id will be visible under the **Source ID** field.

6. Press `Save config` to save the configuration.

## Adding the imgix asset field to a model

1. Navigate to the **Schema** builder.

2. Select the model that you would like to add the **Imgix Field** to and click on it.

3. Select the **Imgix Field** from the **Add fields** right sidebar.

4. Complete the `Display name` field, and the `API ID` will be auto-filled by the system. Optionally, you can also add a `Description`.

5. This screen also allows you to control different properties of your Imgix Field: you can allow multiple values, by selecting the checkbox under the `Field options` section of the screen.

6. Click on the Add button.

## Use imgix in your Hygraph project

To use the imgix asset field in Hygraph, navigate to the **Content Editor** and select the model you added the **Imgix Field** to.

Click on the `Add asset` button to select an asset from your configured imgix source.

If your **Imgix Field** configuration allows multiple values, you will be able to select multiple assets in a content entry as a result. You can use the six-dot handle to reorder these assets by dragging and dropping them in the order you want.

You can also click on the `X` on the right of an asset card to remove it form the list.

## Known limitations

> [!IMPORTANT]
> These are known limitations due to the way Hygraph/our app works. Please read these carefully before using this app.

- If you replace an asset's file in Hygraph, it will not update and show the old version instead. Please delete the asset completely and create a new one if you want to change the displayed image.

- Sometimes, fields might get clipped and the button to add or change assets might not be visible. Refreshing the page resolves the issue. This a rare but known bug for Hygraph apps. If the issue still persists after a refresh open an issue.

## Resources

- [imgix documentation](https://docs.imgix.com/)