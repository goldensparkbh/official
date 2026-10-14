# Golden Spark projects

The navigation opens `#/projects`. The control panel is `#/projects/admin`.
The 50 projects were imported from the local FikraStation catalog at
`C:/Users/athary/code/fikrastation/lib/catalog.ts`. Names, descriptions, parts,
categories, platforms and existing product imagery are retained. Each project
offers an assembled option and an unassembled kit. Individual parts and the
three original tool add-ons are separately orderable and linked to their projects.
Prices remain unset and display “Price on request”.

## Enable the shared store

1. Use the intended Golden Spark Firebase project. Copy `.env.example` to
   `.env.local` and fill in the Firebase web app configuration. These web config
   values identify the app; administrator credentials must never go in Vite variables.
2. Enable Cloud Firestore and Firebase Authentication's Email/Password and
   Anonymous providers. Add the site's production domain and localhost to the
   authorized authentication domains. Functions require a billing-enabled Firebase
   project. Functions run in `us-central1`.
3. Create your administrator account in the Firebase Authentication console.
   On a trusted workstation with Google Application Default Credentials for that
   project, run `node functions/grant-admin.js <account-uid>`. The custom `admin`
   claim protects the control panel and all privileged writes. Sign out and back
   in after granting it. No public sign-up can grant administrator access.
4. Install frontend dependencies with `npm install`, and function dependencies
   with `npm install --prefix functions`. Run `npm run build` and
   `node --test functions/commerce.test.js`.
5. Deploy with your existing Firebase CLI access:
   `firebase deploy --project <intended-project-id> --only firestore:rules,functions,hosting`.
   Confirm the target project before deploying. The existing home page remains
   in the same frontend build. Hash routes work on static hosting.
6. Sign in to the control panel and click **Import catalog**. It creates missing
   products and components without overwriting existing edits. Open **Settings**
   and save the actual Golden Spark WhatsApp number, including country code,
   using digits only. This shared setting is required by the order function.
7. Edit prices, product images, visibility, descriptions and linked products.
   The original `Sparkbox001.jpeg`, `Sparkbox002.jpeg` and `Sparkbox003.jpeg`
   were copied from Downloads. Project cards use the closed branded box; detail
   views use the open unassembled or assembled box according to the selected
   option. These are packaging previews; each project's actual included components
   are listed alongside. Original FikraStation project images are also shown in
   the detail view. All image URLs can be changed in the control panel.

The WhatsApp number intentionally defaults to `XXXXXXXX`, as requested. It can
be saved as a placeholder, but orders cannot be submitted until a valid number
is configured. Never open WhatsApp with a made-up recipient number.

## Order flow

Adding to cart never starts payment. At checkout the customer supplies their
name and contact, and the server saves an `awaiting_confirmation` purchase
request. It validates every item, variant, quantity and current price against
the shared catalog. Repeated submissions with the same order ID return the
original request, preventing duplicates after a connection failure.

WhatsApp opens with the order reference, item names, variants, quantities and
quoted prices. The website cannot verify that the customer sent the WhatsApp
message or made a payment; the administrator confirms those steps manually.
The saved order page offers a link to reopen WhatsApp if needed.

The administrator can move an order from awaiting confirmation to awaiting
payment or paid, then in progress and completed. Unpaid requests can be
cancelled. Paid states require a recorded payment amount. The customer order
page receives live updates, and is readable only by the customer's Firebase
identity or an administrator. Customers should retain the original browser;
anonymous authentication does not provide cross-device order access.

The cart is kept locally between visits; purchase orders and catalog changes
are kept in Firestore across devices. The control panel displays the latest
100 orders. Before public launch, test both customer and administrator roles
against deployed Firestore rules, validate callable functions end to end, and
enable Firebase App Check enforcement on callable functions after configuring
the web App Check provider. The per-user request limit reduces accidental repeat
requests but is not a substitute for App Check against abusive anonymous accounts.

## Configuration status

Without Firebase configuration, the catalog and cart are previewable. Checkout
and admin writes are disabled with an explicit setup message. There is no
fake successful order or browser-only payment record.

## Learning Studio and workshop PDFs

The home page includes a Learning Studio section. The Learn navigation opens
`#/learn/workshops`, with project tutorials, journal articles and `#/learn/library`.
There are six electronics courses and six AI/automation courses, split evenly
between beginner, intermediate and advanced. Each course is a separate catalog
item with a single workshop-PDF license. Prices remain unset.

Run **Import catalog** again after this update to add missing course items without
overwriting prior prices or product edits. You can edit course pricing, visibility,
title, description and preview image in the same product control panel.

Owner PPTX and PDF files are in `output/workshops`. These files are outside the
Hosting build. The deployable PDFs are copied to `functions/workshops`, where
the `downloadWorkshop` function serves them only after verifying Firebase sign-in
and a paid, in-progress or completed order for that exact course and customer.
PPTX files are never returned by the customer endpoint. Private PDFs are not
placed in `public` or `dist`, and the client bundle contains catalog metadata only.

Deploy the updated functions along with the existing Firestore rules and Hosting
build. Course orders use the same WhatsApp confirmation process as physical
projects. Once payment is recorded through the control panel, the customer's
library updates automatically. `XXXXXXXX` remains the WhatsApp placeholder, so
checkout stays disabled until the business intentionally configures a real number.

Customers can add an email/password to their anonymous purchasing identity from
My library to retain access across devices. Linking preserves the same Firebase
UID and existing order ownership. An existing purchasing account can sign in
before an order. Keep Email/Password and Anonymous auth enabled for these flows.

Before deployment, verify that all twelve private PDF files are packaged with
the functions and test the download endpoint with owner, other-user, unpaid,
cancelled, and paid-course cases in the intended Firebase environment. Local
unit tests cover entitlement and variants; actual cloud sign-in and paid downloads
need the Firebase configuration from the setup steps above.

The Tutorials & journal tab lets administrators create, edit, publish and hide
articles, manage content sections and references, and link project IDs. Changes
are stored in projectGuides; deploy the updated rules before using this editor.
Default articles remain available until overridden by an administrator.

This repository is public. Owner PPTX/PDF packs, private functions/workshops PDFs
and slide-authoring sources are excluded from Git. Preserve these local files;
a fresh checkout needs the twelve PDFs restored under functions/workshops before
function deployment. Do not place paid workshop files under public or dist.
