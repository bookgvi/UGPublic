import Vue from 'vue';

if (!window.vueBus) {
  const vueBus = new Vue();
  window.vueBus = vueBus;
}
export default window.vueBus;
