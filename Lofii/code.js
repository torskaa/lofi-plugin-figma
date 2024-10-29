"use strict";
/// <reference types="@figma/plugin-typings" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Jamendo API credentials
const CLIENT_ID = 'eecaa136';
const API_URL = 'https://api.jamendo.com/v3.0';
figma.showUI(__html__, { width: 300, height: 400 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'get-songs') {
        try {
            const response = yield fetch(`${API_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&tags=lofi`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            if (data.headers.status === 'success' && data.results.length > 0) {
                figma.ui.postMessage({ type: 'songs-list', songs: data.results });
            }
            else {
                throw new Error('No songs found or API request failed');
            }
        }
        catch (error) {
            console.error('Error fetching songs:', error);
            figma.ui.postMessage({
                type: 'error',
                message: `Failed to fetch songs: ${error instanceof Error ? error.message : String(error)}`
            });
        }
    }
    else if (msg.type === 'play-song') {
        console.log('Playing song:', msg.songTitle);
    }
});
