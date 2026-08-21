/* ============================================================================
   TSIGOURA VERDE — menu icon set
   Line icons from the restaurant-menu-icons pack (Stroke style), recoloured
   to a single palette via currentColor. Greek-specific dishes the pack does
   not cover (fish, wine, feta, chili, lamb-on-spit, pork shank, chicken,
   carafe, baked potato) are marked '@name' and fall back to a neutral pack
   icon until you drop in the nano-banana SVG (see NANO-BANANA-PROMPTS.md).
   To add a custom icon: CUSTOM.fish = '<svg ...>...</svg>';
   ========================================================================== */

const PACK = {
  sauce: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M4,21.27a12.33,12.33,0,0,1,1.17-.85,15.07,15.07,0,0,1,15.88-.32,33.28,33.28,0,0,0,13.26,4,15.2,15.2,0,0,0,8.35-1.51c2.63-1.29,6.47-2.82,10-2.82,0,0-1.06,12.8-12.73,19.63H23.68S18.73,37.55,16,29.84C16,29.84,13.19,21.27,4,21.27Z"/><polyline points="23.68 39.41 18.61 46 45.13 46 39.94 39.41"/><path d="M52.67,19.78s23.11,4.89-12.73,19.63"/></g></svg>',
  chips: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M46,24.13a7.87,7.87,0,0,1,11.18-2.5A6.81,6.81,0,0,1,60,27.52c0,6.06-3.47,12.19-5.69,15.49a5.67,5.67,0,0,1-4.72,2.48h0a5.74,5.74,0,0,1-4.29-1.92C43,41,38.43,36.78,32.49,35.87a4.84,4.84,0,0,0-5.08,2.31,4.48,4.48,0,0,0-.48,2.56,1.69,1.69,0,0,0,2.71,1.06C33.23,39.09,40.94,32.65,46,24.13Z"/><path d="M18.05,7.87A7.86,7.86,0,0,0,6.87,5.38,6.77,6.77,0,0,0,4,11.26c0,6.06,3.47,12.2,5.69,15.5a5.68,5.68,0,0,0,4.72,2.47h0a5.76,5.76,0,0,0,4.29-1.91c2.27-2.54,6.87-6.8,12.81-7.71a4.83,4.83,0,0,1,5.08,2.32,4.43,4.43,0,0,1,.48,2.55,1.69,1.69,0,0,1-2.71,1.07C30.77,22.83,23.06,16.39,18.05,7.87Z"/><path d="M19.87,38.94A7.82,7.82,0,0,0,9.41,34.33a6.88,6.88,0,0,0-4,5.21c-1.23,6,.94,12.63,2.44,16.3A5.64,5.64,0,0,0,12,59.18h0a5.86,5.86,0,0,0,4.59-1c2.74-2.05,8.11-5.34,14.12-5.08A4.79,4.79,0,0,1,35.2,56.3a4.45,4.45,0,0,1-.05,2.6,1.69,1.69,0,0,1-2.87.52C29.31,56.07,23.05,48.26,19.87,38.94Z"/></g></svg>',
  salad: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M22,47.39H42a1,1,0,0,1,1,1V52a0,0,0,0,1,0,0H21a0,0,0,0,1,0,0V48.38A1,1,0,0,1,22,47.39Z" transform="translate(63.99 99.39) rotate(180)"/><path d="M43,48.15A29.91,29.91,0,0,0,60,31.74V28.38A1.41,1.41,0,0,0,58.58,27H5.42a.62.62,0,0,0-.19,0A1.38,1.38,0,0,0,4,28.38v3.36A30,30,0,0,0,21,48.15"/><polyline points="60 31.74 10.83 31.74 7.16 31.74 4 31.74"/><path d="M45.35,16.72a4,4,0,0,1,3.07-1.4,3.93,3.93,0,0,1,4,3.88v.07a4,4,0,0,1,3.23,3.42,3.89,3.89,0,0,1,2.76,3.7,2.92,2.92,0,0,1,0,.6"/><path d="M29.07,27A3.81,3.81,0,0,0,31,23.68a3.88,3.88,0,0,0-2.54-3.63A4,4,0,0,0,27,19.78h0a3.6,3.6,0,0,0,0-.58A3.87,3.87,0,0,0,25,15.81a3.86,3.86,0,0,0-.71-2.14,4.05,4.05,0,0,0-5.8-.79,4,4,0,0,0-6.37,2A3.88,3.88,0,0,0,9,18.61a3.48,3.48,0,0,0,.09.79,3.9,3.9,0,0,0-2.75,3.7A3.83,3.83,0,0,0,6.84,25a3.94,3.94,0,0,0-1.61,2"/><path d="M45.41,27a6.58,6.58,0,0,0,2.27-3.55l.09-.4a6.34,6.34,0,0,0,.1-1.16h0a6.55,6.55,0,0,0-2.52-5.15,6.88,6.88,0,0,0-4.28-1.47A6.76,6.76,0,0,0,36.52,17"/><path d="M37,27a1.93,1.93,0,0,0,.06-.49,2.53,2.53,0,0,0-1-2,2.52,2.52,0,0,0,0-4.83,3.78,3.78,0,0,0,.52-1.92,3.59,3.59,0,0,0-.09-.81,3.88,3.88,0,0,0-3-2.93,3.41,3.41,0,0,0-.85-.1,4,4,0,0,0-2.15.63,2.7,2.7,0,0,1-3.82-.72,3.55,3.55,0,0,1-.21-.44,3.66,3.66,0,0,0-.65-.06,3.76,3.76,0,0,0-1.58.33"/><path d="M19.91,27A12,12,0,0,0,15,18.25"/><path d="M19.47,24.58a3,3,0,0,0,2.4-2.35"/><path d="M18.71,22.63a10.89,10.89,0,0,1-5-1"/><line x1="41.09" y1="19.65" x2="42.26" y2="18.5"/><line x1="42.05" y1="23.45" x2="42.94" y2="24.32"/></g></svg>',
  bbq: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><ellipse cx="23.38" cy="52.87" rx="4.28" ry="2.82" transform="translate(-30.53 32.02) rotate(-45)"/><circle cx="33.44" cy="42.8" r="4.28"/><path d="M40.59,34.08V30.83a1.45,1.45,0,0,1,1.46-1.45h3.22a1.45,1.45,0,0,1,1.46,1.45v3.51a1.46,1.46,0,0,1-1.57,1.45l-3.23-.25A1.46,1.46,0,0,1,40.59,34.08Z"/><rect x="24.13" y="45" width="8.56" height="5.67" rx="0.98" transform="translate(14.68 101.75) rotate(-135)"/><rect x="34.49" y="34.22" width="8.56" height="6.51" rx="0.98" transform="translate(39.69 91.39) rotate(-135)"/><rect x="44.05" y="25.16" width="8.56" height="5.53" rx="0.98" transform="translate(62.76 81.83) rotate(-135)"/><path d="M54.55,17.18a3.19,3.19,0,1,1,0,4.51L50.28,26"/><line x1="20.35" y1="55.89" x2="16.25" y2="60"/><ellipse cx="11.13" cy="40.62" rx="4.28" ry="2.82" transform="translate(-25.46 19.77) rotate(-45)"/><circle cx="21.2" cy="30.56" r="4.28"/><path d="M28.34,21.84V18.59a1.46,1.46,0,0,1,1.46-1.46H33a1.45,1.45,0,0,1,1.45,1.46v3.5a1.46,1.46,0,0,1-1.57,1.46l-3.22-.26A1.46,1.46,0,0,1,28.34,21.84Z"/><rect x="11.89" y="32.75" width="8.56" height="5.67" rx="0.98" transform="translate(2.43 72.18) rotate(-135)"/><rect x="22.25" y="21.97" width="8.56" height="6.51" rx="0.98" transform="translate(27.45 61.82) rotate(-135)"/><rect x="31.8" y="12.91" width="8.56" height="5.53" rx="0.98" transform="translate(50.51 52.27) rotate(-135)"/><path d="M42.31,4.93a3.19,3.19,0,1,1,0,4.52L38,13.72"/><line x1="8.11" y1="43.65" x2="4" y2="47.75"/></g></svg>',
  burger: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M54.16,39.41a4.62,4.62,0,0,1,2.19,4h0A4.45,4.45,0,0,1,52,48H10.88a4.45,4.45,0,0,1-4.32-4.59h0a4.62,4.62,0,0,1,2.19-4"/><path d="M52.05,39.41a3,3,0,0,1-3,3.14,2.91,2.91,0,0,1-2.45-1.37,3.6,3.6,0,0,0-3-1.77H42.9a3.63,3.63,0,0,0-3,1.78,2.87,2.87,0,0,1-4.89,0,3.6,3.6,0,0,0-3-1.77h-.75a3.61,3.61,0,0,0-3,1.78,2.88,2.88,0,0,1-4.9,0,3.6,3.6,0,0,0-3-1.77h-.75a3.61,3.61,0,0,0-3,1.78,2.87,2.87,0,0,1-4.88,0,3.63,3.63,0,0,0-3-1.78H8.7a2.16,2.16,0,0,1-.11-4.32H54.21a2.16,2.16,0,0,1,2.12,1.8,2.13,2.13,0,0,1-2,2.52H52.05"/><rect x="4" y="29.21" width="56" height="5.89" rx="2.86"/><path d="M9.05,29.21H53.86a2.57,2.57,0,0,0,2.49-2.65h0c0-5.44-3.63-9-8.45-10.18A14.87,14.87,0,0,0,44.32,16H18.59a14.87,14.87,0,0,0-3.58.38c-4.82,1.22-8.45,4.74-8.45,10.18h0A2.58,2.58,0,0,0,9.05,29.21Z"/><path d="M19,16v4.22a2.31,2.31,0,0,0,2.24,2.38h0a2.31,2.31,0,0,0,2.24-2.38V16"/><path d="M39.4,16v4.22a2.31,2.31,0,0,0,2.24,2.38h0a2.31,2.31,0,0,0,2.24-2.38V16"/><path d="M29.22,16v4.22a2.31,2.31,0,0,0,2.24,2.38h0a2.31,2.31,0,0,0,2.24-2.38V16"/></g></svg>',
  juice: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M18,31.6,21.41,59a1.2,1.2,0,0,0,1.21,1H41.38a1.2,1.2,0,0,0,1.21-1L46,31.6"/><polygon points="50 31.6 14 31.6 18.03 26.02 45.97 26.02 50 31.6"/><path d="M46,26V25.2A10.13,10.13,0,0,0,42.89,18h0a10.68,10.68,0,0,0-7.44-3h-6.9a10.68,10.68,0,0,0-7.44,3h0A10.13,10.13,0,0,0,18,25.2V26"/><line x1="30.71" y1="31.6" x2="28.9" y2="54.18"/><path d="M31.15,26,32,14.94l.61-7.64a3.66,3.66,0,0,1,4.76-3.13l7.16,2.21"/></g></svg>',
  beer: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M44.07,4a2.34,2.34,0,0,1,2.24,1.67c1.08,3.65,3.09,12.71-.56,21.09l-1,2.29A60.27,60.27,0,0,0,40,52.55h0s4.14,5.06,0,7.45H23.84c-4.15-2.39,0-7.45,0-7.45h0a60.28,60.28,0,0,0-4.78-23.5l-1-2.29c-3.65-8.38-1.64-17.44-.55-21.09A2.33,2.33,0,0,1,19.77,4Z"/><line x1="23.84" y1="52.55" x2="40.01" y2="52.55"/></g></svg>',
  shot: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M54,5.81,44.46,50.47v8A1.54,1.54,0,0,1,42.9,60H21.1a1.54,1.54,0,0,1-1.56-1.51v-8L10,5.81A1.53,1.53,0,0,1,11.57,4H52.43A1.53,1.53,0,0,1,54,5.81Z"/><path d="M44.46,50.47h0a14.84,14.84,0,0,1-9.14,3.12H28.68a14.84,14.84,0,0,1-9.14-3.12h0"/></g></svg>',
  martini: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><polygon points="54 4 32 28.51 10 4 54 4"/><line x1="32" y1="28.51" x2="32" y2="52.06"/><path d="M20.87,60S32,56.34,32,52.06C32,56.34,43.13,60,43.13,60Z"/></g></svg>',
  bottle: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g data-name="bottle of water"><path d="M35.78,15.9l5.14,4.82A3.37,3.37,0,0,1,42,23.17v5.35a3.24,3.24,0,0,1-.39,1.55L39.83,33.4A3.36,3.36,0,0,0,39.44,35v6.93a3.3,3.3,0,0,0,.48,1.69l1.61,2.69A3.33,3.33,0,0,1,42,48v8.26a4.34,4.34,0,0,1-1.58,3.31h0a2.07,2.07,0,0,1-2.84-.2l-.79-.9a2.06,2.06,0,0,0-3.16.14h0a2,2,0,0,1-3.26,0h0a2.06,2.06,0,0,0-3.16-.14l-.79.9a2.07,2.07,0,0,1-2.84.2h0A4.34,4.34,0,0,1,22,56.22V48a3.33,3.33,0,0,1,.47-1.7l1.61-2.69a3.3,3.3,0,0,0,.48-1.69V35a3.36,3.36,0,0,0-.39-1.55l-1.78-3.33A3.24,3.24,0,0,1,22,28.52V23.17a3.37,3.37,0,0,1,1.08-2.45l5.14-4.82Z"/><path d="M26.73,9.66V6.31A2.38,2.38,0,0,1,29.19,4H34.9a2.39,2.39,0,0,1,2.47,2.31V9.66a1.2,1.2,0,0,1-1.23,1.16H28A1.2,1.2,0,0,1,26.73,9.66Z"/><line x1="29.19" y1="15.9" x2="29.19" y2="10.82"/><line x1="34.9" y1="10.82" x2="34.9" y2="15.9"/><line x1="22" y1="23.17" x2="42" y2="23.17"/><line x1="22" y1="50.44" x2="42" y2="50.44"/></g></svg>',
  dish: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><ellipse cx="34.19" cy="32" rx="10.41" ry="10.45"/><ellipse cx="34.19" cy="32" rx="15.93" ry="16"/><path d="M4,16v8.19a4.94,4.94,0,0,0,1.44,3.49h0a5,5,0,0,1,1.42,3.91l-1,12.09A3.23,3.23,0,0,0,9,47.19H9a3.23,3.23,0,0,0,3.21-3.51l-1-12.09a5,5,0,0,1,1.43-3.91h0a4.93,4.93,0,0,0,1.43-3.49V16"/><line x1="7.37" y1="16" x2="7.37" y2="23.33"/><line x1="10.69" y1="16" x2="10.69" y2="23.33"/><path d="M60,16V44.88A3.12,3.12,0,0,1,56.89,48h0a3.12,3.12,0,0,1-3.11-3.12l1.57-5.35c.5-1.2.22-6.85-.7-7.77h0a3.26,3.26,0,0,1-.94-2.28h0A15.71,15.71,0,0,1,57,19.8Z"/></g></svg>',
  bowl: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M43,45.44V48.6A1.42,1.42,0,0,1,41.58,50H22.43A1.42,1.42,0,0,1,21,48.6V45.44Z"/><path d="M21,46.18h0A29.83,29.83,0,0,1,4,29.91H4V26.59a1.41,1.41,0,0,1,1.43-1.38H58.77A1.39,1.39,0,0,1,60,26.59v3.32A29.88,29.88,0,0,1,43,46.18"/><line x1="60" y1="29.92" x2="4" y2="29.92"/><path d="M26.2,25.21l.12-.19v0a6.53,6.53,0,0,1,2.61-2.1,6.93,6.93,0,0,1,2.72-.57l.61,0a5.07,5.07,0,0,1,.65.09,6.46,6.46,0,0,1,2.9,1.34,6.2,6.2,0,0,1,1.29,1.42"/><path d="M22.07,25.21a9.29,9.29,0,0,1,1.64-3.3,9.12,9.12,0,0,1,2.61-2.34,9.15,9.15,0,0,1,3.34-1.33h0a10.72,10.72,0,0,1,2-.2,10,10,0,0,1,4,.8,9.5,9.5,0,0,1,2.81,1.82,8.69,8.69,0,0,1,2.06,2.64,7.91,7.91,0,0,1,.75,1.91"/><path d="M44.59,25.21a11.87,11.87,0,0,0-2.29-5.84,7.87,7.87,0,0,0-.68-.87,13.31,13.31,0,0,0-15.3-3.39A12.6,12.6,0,0,0,23,17.22a11,11,0,0,0-.85.82,12.46,12.46,0,0,0-1.74,2.29,12,12,0,0,0-1.66,4.88"/><path d="M42.3,19.37a9.86,9.86,0,0,1,9.09,5.84"/><path d="M38.87,16.12a13.19,13.19,0,0,1,17.2,9.09"/><path d="M12.49,25.21A9.8,9.8,0,0,1,22,18h.06"/><path d="M8.05,25.21A12.88,12.88,0,0,1,21,14a13.31,13.31,0,0,1,5.33,1.11"/></g></svg>',
  pizza: '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M12.1,25.39,16.34,27l18.39,7.1L27.44,15.86l-1.7-4.26a24.63,24.63,0,0,1,9.38-1.85,25.1,25.1,0,1,1-23,15.64Z"/><path d="M4,18.66,8.58,20.4a21.92,21.92,0,0,1,12-11.87L18.73,4A26.85,26.85,0,0,0,4,18.66Z"/><path d="M14.8,34.87A20.33,20.33,0,1,0,35.12,14.34a20,20,0,0,0-7.68,1.52l7.29,18.27L16.34,27A20.41,20.41,0,0,0,14.8,34.87Z"/><ellipse cx="40.32" cy="46.38" rx="2.03" ry="3.52" transform="translate(-15.46 20.59) rotate(-24.19)"/><ellipse cx="23.73" cy="40.07" rx="3.49" ry="2.04" transform="translate(-14.54 13.53) rotate(-24.62)"/><ellipse cx="46.52" cy="29.68" rx="3.49" ry="2.04" transform="translate(-8.14 22.08) rotate(-24.62)"/><ellipse cx="30.75" cy="46.69" rx="3.51" ry="2.03" transform="translate(-23.67 59.49) rotate(-69.88)"/><ellipse cx="39.51" cy="23.06" rx="3.51" ry="2.03" transform="translate(4.26 52.23) rotate(-69.88)"/><ellipse cx="46.86" cy="39.34" rx="2.04" ry="3.5" transform="translate(-6.7 68.91) rotate(-68.92)"/><ellipse cx="18.1" cy="17.68" rx="2.23" ry="3.85" transform="translate(-7.2 17.72) rotate(-44.42)"/><path d="M8.58,20.4,28.44,28,20.56,8.53A21.92,21.92,0,0,0,8.58,20.4Z"/></g></svg>',
};

/* ---------------------------------------------------------------------------
   Greek-taverna icons the stock pack does not cover. Same visual language as
   PACK: 64x64 box, currentColor stroke 2.6, round caps/joins — so a feta wedge
   sits next to a pizza slice without looking like a different set.
   --------------------------------------------------------------------------- */
const S_ = '<svg class="ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g>';
const _S = '</g></svg>';
const CUSTOM = {
  /* feta slab with oregano — Φέτα λαδορίγανη, Φέτα σουσάμι μέλι */
  feta: S_+'<path d="M8,36,32,20l24,6L32,44Z"/><path d="M8,36V46l24,8V44"/><path d="M32,44,56,26V36L32,54"/><circle cx="23" cy="34" r="1.7"/><circle cx="41" cy="32" r="1.7"/><path d="M40,15c2-3,6-5,10-5"/><path d="M45,10c0,3,1,5,3,6"/>'+_S,
  /* pork chop / steak with bone — Μπριζόλα, Πανσέτες */
  steak: S_+'<path d="M21,15C33,11,46,15,51,25s-1,23-13,26S14,50,11,38,11,19,21,15Z"/><path d="M26,26c7-3,15-1,18,6s-2,13-9,15-14-1-16-8S19,29,26,26Z"/><path d="M51,25c4-2,9,0,9,5s-5,8-9,7"/>'+_S,
  /* lamb chop with rib bone — Παϊδάκια */
  chop: S_+'<ellipse cx="26" cy="27" rx="17" ry="15"/><ellipse cx="26" cy="27" rx="8" ry="7"/><path d="M39,36,50,47"/><circle cx="53" cy="50" r="5"/>'+_S,
  /* chicken drumstick — Μπούτι / Φιλέτο / Κοτόπουλο σούβλας */
  chicken: S_+'<path d="M51,13A13,13,0,0,0,29,22l-1,6-5,5a9,9,0,0,0,0,13,9,9,0,0,0,13,0l5-5,6-1A13,13,0,0,0,51,13Z"/><path d="M23,46l-7,7"/><circle cx="12" cy="52" r="4.5"/><circle cx="17" cy="57" r="4.5"/>'+_S,
  /* fish — Αντζούγιες, Μπακαλιάρος */
  fish: S_+'<path d="M17,32c0-8,9-15,20-15s19,7,19,15-9,15-19,15S17,40,17,32Z"/><path d="M17,32,6,21V43Z"/><circle cx="46" cy="28" r="2"/><path d="M33,17c2-4,5-6,8-7"/>'+_S,
  /* wine glass (NOT a cocktail) — Ρετσίνα, χύμα κρασί */
  wine: S_+'<path d="M19,8H45V23A13,13,0,0,1,19,23Z"/><line x1="32" y1="36" x2="32" y2="53"/><line x1="21" y1="56" x2="43" y2="56"/><path d="M19,20H45"/>'+_S,
  /* house carafe — χύμα 200ml / 500ml, ούζο, τσίπουρο */
  carafe: S_+'<path d="M27,5H37V18l8,11a11,11,0,0,1,2,6V54a4,4,0,0,1-4,4H21a4,4,0,0,1-4-4V35a11,11,0,0,1,2-6l8-11Z"/><line x1="17" y1="40" x2="47" y2="40"/><line x1="27" y1="10" x2="37" y2="10"/>'+_S,
  /* baked potato — Πατάτες φούρνου */
  bakedpotato: S_+'<ellipse cx="32" cy="35" rx="25" ry="14" transform="rotate(-11 32 35)"/><path d="M16,31c9,5,22,6,31,2"/><rect x="27" y="24" width="10" height="7" rx="1.5"/>'+_S,
  /* courgette — Κολοκυθάκια τηγανητά */
  zucchini: S_+'<path d="M13,51c-5-5-4-13,4-21L35,12c6-6,15-6,19-2s4,13-2,19L34,47C26,55,18,56,13,51Z"/><path d="M51,13l6-6"/><path d="M53,9c3-1,6,0,7,3"/>'+_S,
  /* hot chilli — Καυτερή πιπεριά */
  chili: S_+'<path d="M39,19c6,4,10,12,10,20,0,10-7,17-16,17-7,0-12-4-12-10,0-7,7-9,13-14"/><path d="M39,19c-2-4,0-9,5-10"/><path d="M44,9c3,0,5,2,6,5"/>'+_S,
  /* meat on the spit — σούβλα / κοντοσούβλι */
  lamb: S_+'<line x1="6" y1="49" x2="58" y2="16"/><ellipse cx="20" cy="40" rx="8" ry="6.5" transform="rotate(-32 20 40)"/><ellipse cx="32" cy="32" rx="8" ry="6.5" transform="rotate(-32 32 32)"/><ellipse cx="44" cy="25" rx="8" ry="6.5" transform="rotate(-32 44 25)"/>'+_S,
  /* pork knuckle — Κότσι */
  shank: S_+'<path d="M14,37c0-11,9-18,20-18s19,8,19,18-9,18-19,18S14,48,14,37Z"/><line x1="34" y1="19" x2="34" y2="12"/><circle cx="29" cy="9" r="4.5"/><circle cx="39" cy="9" r="4.5"/>'+_S,
  /* mezze bowl — category icon for Ορεκτικά */
  mezze: S_+'<path d="M7,29H57a25,25,0,0,1-25,22A25,25,0,0,1,7,29Z"/><line x1="14" y1="55" x2="50" y2="55"/><path d="M22,22c0-4,4-7,9-7"/><path d="M34,22c0-6,5-10,11-10"/>'+_S,
  /* consistent category icon family — simple, quiet, same optical weight */
  catApp: S_+'<path d="M13,36H51a18,18,0,0,1-38,0Z"/><line x1="18" y1="49" x2="46" y2="49"/><circle cx="24" cy="27" r="4"/><circle cx="34" cy="25" r="4"/><circle cx="43" cy="28" r="3.5"/>'+_S,
  catSalad: S_+'<path d="M12,35H52a19,19,0,0,1-40,0Z"/><line x1="18" y1="49" x2="46" y2="49"/><path d="M25,29c-6-8-2-14,7-16,1,8-1,14-7,16Z"/><path d="M38,30c-4-7,0-12,8-13,0,7-2,11-8,13Z"/>'+_S,
  catMeat: S_+'<rect x="12" y="34" width="40" height="12" rx="4"/><line x1="18" y1="34" x2="18" y2="46"/><line x1="28" y1="34" x2="28" y2="46"/><line x1="38" y1="34" x2="38" y2="46"/><line x1="48" y1="34" x2="48" y2="46"/><path d="M20,28c6-9,18-9,24,0"/><path d="M27,23c3-5,7-5,10,0"/>'+_S,
  catPizza: S_+'<path d="M18,14A24,24,0,1,1,8,36"/><path d="M18,14,32,34,8,36Z"/><circle cx="41" cy="27" r="3"/><circle cx="35" cy="44" r="3"/><circle cx="49" cy="42" r="3"/>'+_S,
  catDrink: S_+'<path d="M22,13H42V28a10,10,0,0,1-20,0Z"/><line x1="32" y1="38" x2="32" y2="51"/><line x1="23" y1="54" x2="41" y2="54"/><path d="M22,25H42"/>'+_S,
};

/* data icon-key  ->  icon source ('@name' = custom Greek icon) */
const DISH_ICON = {
  dip:'sauce', fries:'chips', potato:'@bakedpotato', salad:'salad', leaf:'salad',
  skewer:'bbq', spit:'@lamb', burger:'burger', patty:'burger', pizza:'pizza',
  soda:'juice', juice:'juice', beer:'beer', mug:'beer', tumbler:'shot', glass:'shot',
  cocktail:'martini', bottle:'bottle', carafe:'@carafe', drink:'@carafe', ouzo:'@carafe',
  cheese:'@feta', chili:'@chili', pepper:'@chili', pot:'bowl', bake:'bowl', zucchini:'@zucchini',
  fish:'@fish', shank:'@shank', meat:'@steak', chicken:'@chicken', drumstick:'@chicken',
  chop:'@chop', wine:'@wine',
};

/* interim pack icon used until the custom Greek icon is generated */
const FALLBACK = {
  bakedpotato:'dish', lamb:'bbq', carafe:'bottle', feta:'dish', chili:'dish',
  fish:'dish', shank:'dish', steak:'dish', chop:'dish', chicken:'dish',
  zucchini:'chips', wine:'martini',
};

const CAT_ICON = {
  appetizers:'@catApp', salads:'@catSalad', meat:'@catMeat', pizza:'@catPizza', drinks:'@catDrink',
};

/* ---------------------------------------------------------------------------
   DISH ART — hand-drawn Greek plate illustrations, mapped 1:1 to dish id.
   Anything not listed here falls back to the line icon above, so the menu
   never shows a wrong picture. Files: media/dishes/*.png
   --------------------------------------------------------------------------- */
const ART_DIR = 'media/dishes/';
/* Authoritative 1:1 map — dish id -> plate illustration (master food-icon set). */
const DISH_ART = {
  /* Ορεκτικά */
  101:'01-tzatziki', 102:'02-tyrosalata', 103:'04-feta-oregano', 104:'03-melitzanosalata',
  105:'05-bougiourdi', 106:'06-feta-honey-sesame', 107:'08-fries', 108:'07-fried-zucchini',
  109:'09-taramosalata', 110:'10-green-chili', 111:'11-oven-beans', 112:'12-oven-potatoes',
  113:'13-anchovies',
  /* Σαλάτες */
  201:'14-tsigoura-salad', 202:'15-cucumber-tomato', 203:'16-horiatiki-salad',
  204:'17-boiled-vegetables', 205:'18-cabbage-carrot',
  /* Κρεατικά */
  301:'19-pork-chop', 302:'20-beef-chop', 303:'21-bifteki', 304:'22-soutzoukaki',
  305:'23-chicken-thigh', 306:'24-chicken-fillet', 307:'25-pork-souvlaki',
  308:'26-chicken-souvlaki', 309:'27-pancetta', 310:'28-lamb-chops', 311:'29-mutton-ribs',
  312:'30-pork-shank', 313:'68-kontosouvli-clean', 314:'32-chicken-spit', 315:'67-lamb-spit-clean',
  316:'34-cod-skordalia', 317:'64-tomahawk-pork', 318:'65-gyros', 319:'66-chicken-nuggets',
  /* Πίτσες */
  401:'35-margherita', 402:'36-special-pizza',
  /* Ποτά */
  501:'37-cola', 502:'38-fanta-lemon', 503:'39-fanta-orange', 504:'40-sprite',
  505:'41-soda', 506:'42-tonic', 507:'43-ice-tea', 508:'44-homemade-lemonade',
  509:'45-draught-beer-large', 510:'46-draught-beer-small', 511:'47-vergina-beer',
  512:'48-heineken', 513:'49-amstel-free', 514:'50-retsina-malamatina',
  515:'51-retsina-georgiadi', 516:'52-house-rose', 517:'53-house-red',
  518:'54-house-white', 519:'55-king-hearts-red', 520:'56-ouzo', 521:'57-tsipouro',
  522:'58-idoniko', 523:'59-whiskey-bottle', 524:'60-vodka-bottle', 525:'61-rum-bottle',
  526:'62-campari-bottle', 527:'63-spirits-portion',
};
/* representative plate for each category chapter */
const CAT_ART = {
  appetizers:'01-tzatziki', salads:'16-horiatiki-salad',
  spit:'67-lamb-spit-clean', meat:'65-gyros', pizza:'35-margherita', drinks:'53-house-red',
};
function safeMediaPath(v){
  v=String(v||'').trim();
  if(!v) return '';
  if(/^https?:\/\//i.test(v)) return v;
  v=v.replace(/^\/+/,'').replace(/\\/g,'/');
  return v.includes('..') ? '' : v;
}
function dishArt(i){ const custom=safeMediaPath(i&&i.image); if(custom) return custom; const f=i&&DISH_ART[i.id]; return f?ART_DIR+f+'.png':''; }
function catArtSrc(c){
  const custom=safeMediaPath(c&&c.image);
  if(custom && !/(?:^|\/)cat-[a-z0-9-]+\.png$/i.test(custom)) return custom;
  const f=c&&CAT_ART[c.id]; return f?ART_DIR+f+'.png':'';
}

const GREEK_FOOD_BASE = 'media/dishes/';
const GREEK_FOOD_ICON = {
  101:'01-tzatziki.png', 102:'02-tyrosalata.png', 103:'04-feta-oregano.png',
  104:'03-melitzanosalata.png', 105:'05-bougiourdi.png', 106:'06-feta-honey-sesame.png',
  107:'08-fries.png', 108:'07-fried-zucchini.png', 109:'09-taramosalata.png',
  110:'10-green-chili.png', 111:'11-oven-beans.png', 112:'12-oven-potatoes.png',
  113:'13-anchovies.png',
  201:'14-tsigoura-salad.png', 202:'15-cucumber-tomato.png', 203:'16-horiatiki-salad.png',
  204:'17-boiled-vegetables.png', 205:'18-cabbage-carrot.png',
  301:'19-pork-chop.png', 302:'20-beef-chop.png', 303:'21-bifteki.png',
  304:'22-soutzoukaki.png', 305:'23-chicken-thigh.png', 306:'24-chicken-fillet.png',
  307:'25-pork-souvlaki.png', 308:'26-chicken-souvlaki.png', 309:'27-pancetta.png',
  310:'28-lamb-chops.png', 311:'29-mutton-ribs.png', 312:'30-pork-shank.png',
  313:'68-kontosouvli-clean.png', 314:'32-chicken-spit.png', 315:'67-lamb-spit-clean.png',
  316:'34-cod-skordalia.png', 317:'64-tomahawk-pork.png', 318:'65-gyros.png',
  319:'66-chicken-nuggets.png',
  401:'35-margherita.png', 402:'36-special-pizza.png',
  501:'37-cola.png', 502:'38-fanta-lemon.png', 503:'39-fanta-orange.png',
  504:'40-sprite.png', 505:'41-soda.png', 506:'42-tonic.png',
  507:'43-ice-tea.png', 508:'44-homemade-lemonade.png',
  509:'45-draught-beer-large.png', 510:'46-draught-beer-small.png',
  511:'47-vergina-beer.png', 512:'48-heineken.png', 513:'49-amstel-free.png',
  514:'50-retsina-malamatina.png', 515:'51-retsina-georgiadi.png',
  516:'52-house-rose.png', 517:'53-house-red.png', 518:'54-house-white.png',
  519:'55-king-hearts-red.png', 520:'56-ouzo.png', 521:'57-tsipouro.png',
  522:'58-idoniko.png', 523:'59-whiskey-bottle.png', 524:'60-vodka-bottle.png',
  525:'61-rum-bottle.png', 526:'62-campari-bottle.png', 527:'63-spirits-portion.png',
};
const GREEK_CAT_ICON = {
  appetizers:'05-bougiourdi.png',
  salads:'16-horiatiki-salad.png',
  spit:'67-lamb-spit-clean.png',
  meat:'65-gyros.png',
  pizza:'35-margherita.png',
  drinks:'50-retsina-malamatina.png',
};

function svgFor(src){
  if(!src) return PACK.dish;
  if(src[0]==='@'){ const n=src.slice(1); return CUSTOM[n] || PACK[FALLBACK[n]||'dish'] || PACK.dish; }
  return PACK[src] || PACK.dish;
}
/* Accept basename ("16-horiatiki-salad.png"), relative ("media/dishes/…"),
   or absolute URL — never double-prefix media/dishes/. */
function resolveFoodCssUrl(pathOrFile){
  const v=String(pathOrFile||'').trim();
  if(!v) return '';
  if(/^https?:\/\//i.test(v) || /^data:/i.test(v) || /^blob:/i.test(v)) return v;
  const clean=v.replace(/^\/+/,'');
  if(clean.includes('/')) return clean;
  return GREEK_FOOD_BASE+clean;
}
/* Placeholder paths that were saved into live state but never shipped as files. */
function isMissingCatPlaceholder(path){
  return /(?:^|\/)cat-[a-z0-9-]+\.png$/i.test(String(path||''));
}
function pngIcon(file){
  const url=resolveFoodCssUrl(file);
  if(!url) return PACK.dish;
  return `<span class="greek-ic" style="--food:url('${url}')" aria-hidden="true"></span>`;
}
function dishIcon(i){ return (i&&GREEK_FOOD_ICON[i.id]&&!i.iconOverride) ? pngIcon(GREEK_FOOD_ICON[i.id]) : svgFor(DISH_ICON[i&&i.icon] || i&&i.icon || 'dish'); }
function catIcon(c){
  if(c&&GREEK_CAT_ICON[c.id]&&!c.iconOverride) return pngIcon(GREEK_CAT_ICON[c.id]);
  const custom=(c&&(c.imageIcon||c.image))||'';
  if(custom && !isMissingCatPlaceholder(custom)) return pngIcon(custom);
  return svgFor(DISH_ICON[c&&c.icon] || CAT_ICON[c&&c.id] || c&&c.icon || 'dish');
}
