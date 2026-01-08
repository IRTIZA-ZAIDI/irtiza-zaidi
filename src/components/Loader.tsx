import "./Loader.css";

export function Loader() {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden bg-background">
      {/* Background with slight grain or simple color matches theme */}

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <span className="loader"></span>
        <p className="text-foreground font-mono text-xs uppercase tracking-widest mt-4">
          Initializing Model Parameters...
        </p>
      </div>
    </div>
  );
}
