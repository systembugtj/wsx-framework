/**
 * WSX Framework Examples - Main Entry Point
 *
 * This demonstrates how to use WSX Framework to build a complete application.
 * The App component showcases all framework features and example components.
 */

import { createLogger } from '@systembug/wsx-core';
import './App.wsx';

const logger = createLogger('Main');

// Initialize the application
function initApp() {
  const appContainer = document.getElementById('app');

  if (!appContainer) {
    logger.error('App container not found');
    return;
  }

  // Mount the WSX App component
  appContainer.innerHTML = '<wsx-app></wsx-app>';

  logger.info('WSX Framework Example App initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
