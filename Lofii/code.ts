/// <reference types="@figma/plugin-typings" />

// Jamendo API credentials
const CLIENT_ID = 'eecaa136';
const API_URL = 'https://api.jamendo.com/v3.0';

figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-songs') {
    try {
      const response = await fetch(`${API_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&tags=lofi`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.headers.status === 'success' && data.results.length > 0) {
        figma.ui.postMessage({ type: 'songs-list', songs: data.results });
      } else {
        throw new Error('No songs found or API request failed');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      figma.ui.postMessage({ 
        type: 'error', 
        message: `Failed to fetch songs: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  } else if (msg.type === 'play-song') {
    console.log('Playing song:', msg.songTitle);
  }
};
