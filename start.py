#!/usr/bin/env python3
"""
⚖️ ClauseProof One-Command Full-Stack Launcher
Starts both the FastAPI backend (port 8000) and React+TS frontend (port 3000).
Handles clean Ctrl+C shutdown across all operating systems.
"""

import subprocess
import sys
import time
import os
import signal
import threading

def print_banner():
    print("=" * 65)
    print(" ⚖️  CLAUSEPROOF REGTECH PLATFORM — FULL STACK LAUNCHER")
    print("=" * 65)
    print(" 🚀 Starting FastAPI Backend on : http://localhost:8000")
    print(" 🚀 Starting React+TS Frontend on : http://localhost:3000")
    print(" 🔒 Deterministic Rule Engine   : Active (SEBI ICDR 2025)")
    print(" 🔗 Cryptographic Audit Trail   : SHA-256 Hash Chained")
    print("=" * 65)
    print(" Press Ctrl+C at any time to cleanly stop all services.")
    print("=" * 65 + "\n")

def stream_logs(pipe, prefix, color_code):
    """Reads lines from a process stream and prints them with a colored prefix."""
    try:
        for line in iter(pipe.readline, ''):
            if not line:
                break
            print(f"\033[{color_code}m{prefix}\033[0m {line.rstrip()}")
    except Exception:
        pass

def main():
    print_banner()
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    client_dir = os.path.join(root_dir, "client")

    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    # Ensure npm install was run in client
    if not os.path.exists(os.path.join(client_dir, "node_modules")):
        print("\033[33m[SETUP]\033[0m Installing frontend dependencies (npm install)...")
        subprocess.run([npm_cmd, "install"], cwd=client_dir, check=True)

    processes = []

    try:
        # 1. Start FastAPI Backend
        venv_dir = os.path.join(backend_dir, "venv")
        if os.name == "nt":
            venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
            venv_pip = os.path.join(venv_dir, "Scripts", "pip.exe")
        else:
            venv_python = os.path.join(venv_dir, "bin", "python")
            venv_pip = os.path.join(venv_dir, "bin", "pip")

        if not os.path.exists(venv_python):
            print("\033[33m[SETUP]\033[0m Creating Python virtual environment in backend/venv...")
            subprocess.run([sys.executable, "-m", "venv", "venv"], cwd=backend_dir, check=True)
            if os.name == "nt":
                venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
                venv_pip = os.path.join(venv_dir, "Scripts", "pip.exe")
            else:
                venv_python = os.path.join(venv_dir, "bin", "python")
                venv_pip = os.path.join(venv_dir, "bin", "pip")

        # Check if uvicorn & core dependencies are installed in venv
        try:
            subprocess.run(
                [venv_python, "-c", "import uvicorn, fastapi, sqlalchemy"],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        except Exception:
            print("\033[33m[SETUP]\033[0m Installing backend requirements (pip install -r requirements.txt)...")
            subprocess.run([venv_pip, "install", "-r", "requirements.txt"], cwd=backend_dir, check=True)

        print("\033[36m[BACKEND]\033[0m Launching FastAPI Uvicorn Server...")
        backend_cmd = [venv_python, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"]
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(backend_proc)
        threading.Thread(target=stream_logs, args=(backend_proc.stdout, "[BACKEND]", "36"), daemon=True).start()

        # Removed time.sleep(1.5) so frontend starts concurrently with backend

        # 2. Start React Frontend
        print("\033[35m[CLIENT]\033[0m Launching Vite React+TS Dev Server...")
        client_cmd = [npm_cmd, "run", "dev", "--", "--port", "3000", "--host"]
        client_proc = subprocess.Popen(
            client_cmd,
            cwd=client_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(client_proc)
        threading.Thread(target=stream_logs, args=(client_proc.stdout, "[CLIENT ]", "35"), daemon=True).start()

        # Keep main thread alive waiting for processes
        while all(p.poll() is None for p in processes):
            time.sleep(0.5)

    except KeyboardInterrupt:
        print("\n\033[33m[SHUTDOWN]\033[0m Ctrl+C detected. Stopping all ClauseProof services...")
    finally:
        for p in processes:
            try:
                if p.poll() is None:
                    p.terminate()
                    p.wait(timeout=3)
            except Exception:
                try:
                    p.kill()
                except Exception:
                    pass
        print("\033[32m[SHUTDOWN]\033[0m All services stopped cleanly. Goodbye! 👋")

if __name__ == "__main__":
    main()
