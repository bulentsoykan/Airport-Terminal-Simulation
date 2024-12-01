# Airport-Terminal-Simulation - Crowd Flow Simulation

This repository contains a **basic crowd flow simulation** built using **Vite**, **React**, and **TypeScript**. The simulation demonstrates how agents move through multiple zones (entry, security, waiting, and exit) with different behaviors and speeds. It features a modular architecture with clear separation of simulation logic, visualization, and utility functions.

---

## **Features**

### **Simulation Logic**
- **Agent Behaviors**: Agents can have normal or rushed behavior and move towards specific destinations.
- **Collision Detection**: Basic collision detection with zones.
- **Adjustable Speed**: Control simulation speed dynamically.
- **Pause/Resume and Reset**: Full control over the simulation state.

### **Visualization**
- **Real-Time Updates**: Watch agents move through zones in real time.
- **HTML Canvas Rendering**: Simulation is rendered using a performant HTML Canvas.

### **Modular Architecture**
- **Components**:
  - `SimulationCanvas`: Handles simulation rendering.
  - `SimulationControls`: Provides UI for controlling the simulation.
- **Utilities**: Includes helper functions for agent movement and zone management.
- **Types**: Centralized TypeScript types for improved maintainability.

---

## **How to Run**

### **Prerequisites**
- Node.js  
- npm or yarn

### **Steps**
**Clone the Repository**
## Install Dependencies
To set up the project, install the required dependencies using npm.

## Start the Development Server
Run the development server to access the application locally 

## Build for Production
Generate production-ready files, which will be located in the `dist` folder.

## Run in Preview Mode
Serve the production build locally to test and preview the application.

---

## How to Use
1. Open the application in your browser.
2. Use the controls panel to:
   - Start, pause, or reset the simulation.
   - Adjust the simulation speed using the slider.
3. Observe how agents navigate through the zones in real time.

---

## Extending the Simulation
This project is modular and can be enhanced with additional features, such as:
- Adding complex pathfinding algorithms.
- Implementing agent-to-agent collision detection.
- Creating heat maps for visualizing density.
- Adding detailed statistics and analytics for simulation data.


