import './bootstrap.js';
import '../css/app.css';
import { createApp } from 'vue'
import RegistrationApp from './registration/App.vue'

const components = {
  RegistrationApp,
}

const el = document.getElementById('vue-root')

if (el) {
  const componentName = el.dataset.component
  const Component = components[componentName]

  if (Component) {
    createApp(Component).mount(el)
  } else {
    console.warn(`Vue component "${componentName}" not found.`)
  }
}
