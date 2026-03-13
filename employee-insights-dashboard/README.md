# Employee Insights Dashboard

This project is a React-based Employee Insights Dashboard designed to demonstrate advanced frontend engineering concepts including virtualization, browser hardware interaction, canvas manipulation, and custom data visualization.

The assignment evaluates engineering depth, understanding of the DOM, browser APIs, and React lifecycle management.

---

## Tech Stack

**Frontend Framework**
- React (Vite)

**Styling**
- Tailwind CSS

**Routing**
- React Router

**Visualization**
- Raw SVG for analytics charts

**Mapping**
- Leaflet + OpenStreetMap

**Browser APIs**
- Camera API (`navigator.mediaDevices.getUserMedia`)
- HTML5 Canvas

---

## Features

### 1. Secure Authentication

The application uses a simple authentication flow implemented with React Context.

**Login Credentials:**
```
Username: testuser
Password: Test123
```

**Implementation details:**
- Authentication state is stored using React Context
- Session persistence is handled using `localStorage`
- Protected routes prevent unauthorized navigation to `/list`

**Security behavior:**
- If a user navigates directly to `/list` without authentication, they are redirected to the login page
- Refreshing the page maintains the session using stored credentials

---

### 2. High Performance Virtualized Grid

The employee table implements **custom virtualization** to efficiently render large datasets without relying on libraries like `react-window` or `react-virtualized`.

Only rows visible in the viewport are rendered.

#### Virtualization Strategy

Instead of rendering the entire dataset, the component renders only a subset of rows based on scroll position.

#### Core Calculations
```
rowHeight = 50px
containerHeight = 500px
visibleRows = containerHeight / rowHeight
visibleRows = 500 / 50 = 10

buffer = 5
startIndex = floor(scrollTop / rowHeight) - buffer
endIndex = startIndex + visibleRows + buffer * 2

10 visible rows + 10 buffered rows = ≈ 20 rows rendered
```

#### Scroll Height Simulation
The scroll container simulates the full dataset height using:
```
totalHeight = rowCount * rowHeight
```

The rendered rows are then positioned using:
```
top = startIndex * rowHeight
```

This approach maintains native scrolling while minimizing DOM nodes.

---

### 3. Identity Verification System

The details page provides a browser-based identity verification flow using the device camera and signature capture.

#### Camera Access
Camera access is implemented using the browser MediaDevices API:
```javascript
navigator.mediaDevices.getUserMedia()
```

The returned media stream is attached to a `<video>` element to display a live camera preview.

#### Photo Capture
A frame from the video stream is captured using a hidden canvas element.

**Steps:**
1. Create canvas context
2. Draw the current video frame
3. Export image
```javascript
canvas.drawImage(video, 0, 0)
canvas.toDataURL()
```

The result is a Base64 encoded image string.

#### Signature Capture
Users sign their name on a canvas element using mouse input.

**Canvas events used:**
- `mousedown` → start drawing
- `mousemove` → draw line
- `mouseup` → stop drawing

The signature is stored as a canvas layer.

---

### 4. Image Merging (Audit Image)

The final audit image merges:
- Employee Photo + User Signature = Audit Image

**Implementation process:**
1. Create a new canvas
2. Draw the captured photo
3. Draw the signature canvas overlay
4. Export the merged image

**Example logic:**
```javascript
ctx.drawImage(photo, 0, 0)
ctx.drawImage(signatureCanvas, x, y)
canvas.toDataURL()
```

The merged image can be previewed and downloaded.

---

### 5. Salary Analytics (Custom SVG Chart)

Salary distribution by city is implemented using raw SVG elements.

**Steps:**
1. Aggregate salary by city
2. Normalize values relative to the maximum salary
3. Render SVG bars

**SVG elements used:**
- `<rect>` → bar
- `<text>` → labels

This avoids the use of external chart libraries such as Chart.js or D3.

---

### 6. Geospatial City Visualization

City locations are displayed using Leaflet with OpenStreetMap tiles.

Since the API returns only city names, a static mapping between city names and geographic coordinates is used.

**Example mapping:**
```
London → [51.5072, -0.1276]
Tokyo → [35.6762, 139.6503]
New York → [40.7128, -74.006]
San Francisco → [37.7749, -122.4194]
```

Markers are rendered for each unique city.

---

## Intentional Bug (Required by Assignment)

### Camera Stream Memory Leak

**Location:**
`src/pages/details.jsx`

#### Description
The camera stream created using `navigator.mediaDevices.getUserMedia` is not cleaned up when the component unmounts.

**Current implementation:**
```javascript
useEffect(() => {
  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    videoRef.current.srcObject = stream;
  }
  startCamera();
}, []);
```

#### Problem
The stream tracks are not stopped when leaving the page. As a result, the camera may continue running in memory even after navigating away from the verification page.

#### Correct Implementation (Not Used Intentionally)
```javascript
return () => {
  stream.getTracks().forEach(track => track.stop());
};
```

#### Why This Bug Was Chosen
This demonstrates a common real-world issue when working with browser hardware APIs in React applications where media streams must be explicitly cleaned up. The bug does not break application functionality but represents a realistic lifecycle management issue.

---

## Running the Project

**Install dependencies:**
```bash
npm install
```

**Start development server:**
```bash
npm run dev
```

**Open in browser:**
```
http://localhost:5173
```

---

## Folder Structure

```
src
├─ components
│ ├─ VirtualizedTable.jsx
│ ├─ SalaryChart.jsx
│ └─ CityMap.jsx
│
├─ pages
│ ├─ Login.jsx
│ ├─ List.jsx
│ ├─ Details.jsx
│ └─ Analytics.jsx
│
├─ auth
│ └─ AuthContext.jsx
│
├─ api
│ └─ employeeApi.js
│
└─ utils
  └─ fixLeafletIcon.js
```

---

## Conclusion

This project demonstrates:
- Custom virtualization without external libraries
- Browser hardware interaction via camera APIs
- Canvas-based image processing
- SVG-based analytics visualization
- Geospatial data representation

The architecture prioritizes performance, maintainability, and efficient DOM rendering.
```