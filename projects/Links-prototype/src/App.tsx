import './App.css'
import CDMPanel from './components/CDMPanel'
import LocalPanel from './components/LocalPanel'
import DocRefInspector from './components/DocRefInspector'
import AdminRules from './components/AdminRules'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">Doc Ref Prototype</header>
      <div className="app-grid">
        <aside className="sidebar-left">
          <AdminRules />
        </aside>
        <main className="panel-cdm">
          <CDMPanel />
        </main>
        <section className="panel-local">
          <LocalPanel />
        </section>
        <aside className="sidebar-right">
          <DocRefInspector />
        </aside>
      </div>
    </div>
  )
}

export default App
