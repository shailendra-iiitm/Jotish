# Employee Insights Dashboard

GitHub Repo: https://github.com/shailendra-iiitm/Jotish

This is my submission for the **Employee Insights Dashboard** assignment. The implementation focuses on the core engineering requirements such as secure routing, custom virtualization, camera + signature merging, SVG-based analytics, and map visualization.

## What Is Implemented

* Login with required credentials: `testuser / Test123`
* Persistent authentication using `localStorage` with protected routes
* List page with **custom row virtualization** (no `react-window` or `react-virtualized`)
* Details page with **camera capture and signature overlay canvas**
* Final merged **audit image (photo + signature)** exported as a PNG data URL
* Analytics page with **custom SVG salary chart** and **Leaflet city map**

### API Used

POST
`https://backend.jotish.in/backend_dev/gettabledata.php`

Payload:

```json
{
  "username": "test",
  "password": "123456"
}
```

## Intentional Bug (Required)

One bug has intentionally been left in the application.

**Type:** Camera stream memory leak
**Location:** `src/pages/details.jsx`

The camera is started using `navigator.mediaDevices.getUserMedia()`, but the media tracks are not stopped when the component unmounts. Because of this, the camera stream may continue running in the background after leaving the page, which can lead to unnecessary resource usage.

This was intentionally left in place since it reflects a common lifecycle mistake when working with React and browser hardware APIs.

The proper cleanup would normally look like this (not implemented intentionally):

```js
return () => {
  const stream = videoRef.current?.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};
```

## Virtualization Logic (Short)

In `src/components/virtualizedTable.jsx`, rows are rendered based on the current scroll offset.

* `rowHeight = 50`
* `containerHeight = 500`
* `visibleRows = ceil(containerHeight / rowHeight)`
* `startIndex = max(0, floor(scrollTop / rowHeight) - buffer)`
* `endIndex = min(totalRows, startIndex + visibleRows + 2 * buffer)`

Only the visible rows (plus a small buffer) are rendered, while the total scroll height is simulated using a spacer container so the scrollbar behaves as if all rows exist in the DOM.

## Run Locally

```bash
npm install
npm run dev
```

Then open:

`http://localhost:5173`
