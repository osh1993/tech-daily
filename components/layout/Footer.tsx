import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Tech Daily. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="mailto:feedback@techdaily.com"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="피드백 보내기"
            >
              <Mail className="h-4 w-4" />
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
