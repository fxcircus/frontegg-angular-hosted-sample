# Getting Started with Frontegg Hosted Login-Box and Angular

This sample is a [Frontegg Hosted Login-Box sample crafted with Angular](https://docs.frontegg.com/docs/angular-hosted-login-guide)

## Running the sample

After cloning the project, install it using

### `npm install`

- Open `src/app/app.module.ts`, add your Client ID and API Key from `Frontegg Portal ➜ [ENVIRONMENT] ➜ Env Settings page`:

```
FronteggAppModule.forRoot(
      {
        contextOptions: {
          baseUrl: "https://[YOUR-SUB-DOMAIN].frontegg.com",
          clientId: "[YOUR-CLIENT-ID]", // Replace with Client ID from Frontegg Portal ➜ [ENVIRONMENT] ➜ Env Settings page
          tenantResolver: () => ({
            tenant: new URLSearchParams(window.location.search).get("organization"),
          })
        },
        authOptions: {
          // disableSilentRefresh: true, // disables token refreshes
          enableSessionPerTenant: true // enables separate sessions for each new tab
        },
        hostedLoginBox: true,
      }
    ),
```


In order to run the project, run
### `npm start`

The application will be opened on [http://localhost:3000](http://localhost:3000) in development mode
In order to trigger the login, click on the Login button in order to redirect to your login box.
