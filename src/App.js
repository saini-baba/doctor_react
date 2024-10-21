import "./App.css";
import { Nav } from "./component/Nav";
import { Hero } from "./component/Hero";
function App() {
  return (
    <body>
      <header>
        <Nav />
      </header>
      <main>
        <Hero />
      </main>
      <footer></footer>
    </body>
  );
}

export default App;
