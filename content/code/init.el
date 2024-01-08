;; -*- coding: utf-8; lexical-binding: t -*-

;; Credentials are in a separate file so that the don't end up in public repo.
(load "~/.config/emacs/credentials.el")

;; Squeeze out some perfomance.
(setq gc-cons-threshold 100000000)
(setq max-specpdl-size 5000)

;; Initalize package
(require 'package)
(add-to-list 'package-archives
             '("melpa" . "https://melpa.org/packages/"))
(package-initialize)

;; Disable the "More Information about Emacs System" startup message.
(defun display-startup-echo-area-message ()
  (message ""))

(defun wl/random-choice (items)
  (nth (random (length items)) items))

(setq scratch-messages '(";; Approved by The Alphabet Bois\n"
                         ";; NSA Inside\n"
                         ";; Not Copyrighted by Anyone 1432-1785\n"
                         ";; NSA Controlled Since 1952\n"
                         ";; Spyware Embedded Deep Inside\n"
                         ";; UwU\n"
                         ";; <3\n"
                         ";; Quicksort is Quick\n"
                         ";; I Have a Smooth Brain\n"
                         ";; I Probably Have Bipolar Disorder\n"))

(setq quit-messages '("You will regret this. "
                      "Come on, do it, see if I care. "
                      "Get out of here and go back to your boring programs. "))

(setq initial-scratch-message (wl/random-choice scratch-messages))

(add-hook 'kill-emacs-query-functions
          (lambda () (y-or-n-p (wl/random-choice quit-messages)))
          'append)

;; Improve some emacs defaults.
(setq
 inhibit-startup-screen t
 intial-scratch-message nil
 sentence-end-double-space nil
 ring-bell-function 'ignore
 save-interprogram-paste-before-kill t
 use-dialog-box nil
 use-short-answers nil
 load-prefer-newer t
 confirm-kill-processes nil
 native-comp-async-report-warnings-errors 'silent
 help-window-select t
 delete-by-moving-to-trash t
 scroll-preserve-screen-position t
 completions-detailed t
 next-error-message-highlight t
 read-minibuffer-restore-windows t)

;; Better tab handling.
(setq-default indent-tabs-mode nil)
(setq-default tab-width 4)

;; Disable custom file.
(setq custom-file (make-temp-name "/tmp/"))

(delete-selection-mode t)
(savehist-mode)

(set-charset-priority 'unicode)
(prefer-coding-system 'utf-8-unix)

;; Disable auto-save & backup files.
(setq
 make-backup-files nil
 auto-save-default nil
 create-lockfiles nil)

;; Scrolling.
(setq
 scroll-conservatively 101
 scroll-up-aggressively 0.01
 scroll-down-aggressively 0.01
 auto-window-vscroll nil)

;; Auto bracket closing.
(setq electric-pair-preserve-balance t
      electric-pair-open-newline-between-pairs t
      electric-pair-delete-adjacent-pairs t)

(electric-pair-mode 1)

;; Remove ui clutter.
(toggle-frame-maximized)
(menu-bar-mode -1)
(scroll-bar-mode -1)
(if (eq system-type 'darwin)
    (tool-bar-mode 1)
    (tool-bar-mode -1))

;; Fira Code is definitely my fav font.
(add-to-list 'default-frame-alist '(font . "Fira Code 12"))
(set-face-attribute 'default t :font "Fira Code 12")

;; Path needs to be set for ocaml-lsp because it doesn't work otherwise.
(setenv "PATH"
        (concat
         "/home/wiljam/.opam/default/bin" path-separator
         "/usr/local/sbin" path-separator
         "/usr/local/bin" path-separator
         "/usr/lib/rustup/bin" path-separator
         (getenv "PATH")))

;; Some visual guides.
(require 'hl-line)
(add-hook 'prog-mode-hook #'hl-line-mode)

(set-face-foreground 'fill-column-indicator "#202020")
(setq display-fill-column-indicator-column 79)
(global-display-fill-column-indicator-mode 1)

(global-display-line-numbers-mode 1)
(setq display-line-numbers-type 'relative)

(defun wl/disable-line-numbers ()
  (display-line-numbers-mode -1)
  (display-fill-column-indicator-mode -1))

(use-package highlight-indent-guides
      :ensure t
      :hook
      ((prog-mode text-mode conf-mode) . highlight-indent-guides-mode)
      :init
      (setq highlight-indent-guides-method 'character
            highlight-indent-guides-auto-enabled nil
            highlight-indent-guides-responsive 'top)
      :config
      (set-face-foreground 'highlight-indent-guides-character-face "#303030")
      (set-face-foreground 'highlight-indent-guides-top-character-face "#707070"))

(add-hook 'after-make-frame-functions #'highlight-indent-guides-auto-set-faces)

(highlight-indent-guides-mode t)

;; Hooks
(add-hook 'text-mode-hook #'wl/disable-line-numbers)
(add-hook 'before-save-hook #'delete-trailing-whitespace)
(add-hook 'vterm-mode-hook #'wl/disable-line-numbers)

(require 'use-package)

;; I can't live without evil-mode.
(use-package evil
  :ensure t
  :init
  (setq evil-want-integration t)
  (setq evil-want-keybinding nil)
  :config
  (evil-mode))
(use-package evil-collection
  :after evil
  :ensure t
  :config
  (evil-collection-init))

(use-package projectile
  :ensure t
  :config
  (projectile-mode +1))

;; Language Support.
(use-package tuareg
  :ensure t)

(use-package go-mode
  :ensure t
  :config
  (add-to-list 'exec-path "/home/wiljam/go/bin"))

(use-package kotlin-mode
  :ensure t)

;; Tree-Sitter doesn't work with kotlin and I don't care enough to fix it properly.
(add-hook 'kotlin-mode-hook
          #'(lambda ()
              (tree-sitter-mode -1)))

(use-package haskell-mode
  :ensure t)

(use-package tree-sitter
  :ensure t
  :config
  (global-tree-sitter-mode)
  (add-hook 'tree-sitter-after-on-hook #'tree-sitter-hl-mode))
(use-package tree-sitter-langs
  :ensure t)
(use-package tree-sitter-indent
  :ensure t)

;; LSP
(use-package eglot
  :ensure t
  :hook
  ;; Do I need to tell you for what languages these are?
  (c-mode . eglot-ensure)
  (c++-mode . eglot-ensure)
  (python-mode . eglot-ensure)
  (js-mode . eglot-ensure)
  (go-mode . eglot-ensure)
  (kotlin-mode . eglot-ensure)
  (haskell-mode . eglot-ensure)

  ;; OCaml Support
  (tuareg-mode . eglot-ensure))

(defun wl/eglot-config ()
  (eglot-inlay-hints-mode -1)
  (setq
   eglot-ignored-server-capabilities '(:documentHighlightProvider)
   eldoc-echo-area-use-multiline-p nil))

(add-hook 'eglot-managed-mode-hook #'wl/eglot-config)

(use-package company
  :ensure t
  :hook
  (after-init . global-company-mode))

;; Search should be fuzzy by default.
(use-package orderless
  :ensure t
  :init
  (setq completion-styles '(orderless basic)
        completion-category-defaults nil
        completion-category-overrides '((file (styles partial-completion)))))

(use-package vertico
  :ensure t
  :init
  (vertico-mode))

;; Some nice theming.
(use-package gruber-darker-theme
  :ensure t)

(use-package fleetish-theme
  :ensure t)

(load-theme 'gruber-darker t)

;; And some nice visuals.
(use-package all-the-icons
  :ensure t)

(use-package doom-modeline
  :ensure t
  :init (doom-modeline-mode 1))

(use-package neotree
  :ensure t
  :config
  (setq neo-theme (if (display-graphic-p) 'icons 'arrow)))

(use-package which-key
  :ensure t
  :config
  (which-key-mode))

(use-package helpful
  :ensure t)

;; I think editorconfig should become standard in all open-source projects.
(use-package editorconfig
  :ensure t
  :config
  (editorconfig-mode 1))

;; Keybindings
(defun wl/keymap (key fun)
  (define-key evil-normal-state-map (kbd key) fun))

(wl/keymap "SPC f p"
           #'(lambda ()
               (interactive)
               (find-file "~/.config/emacs")))

(wl/keymap "SPC f n"
           #'(lambda ()
               (interactive)
               (find-file "~/Programming/w-garden/content")))

(wl/keymap "SPC p" 'projectile-command-map)
(wl/keymap "SPC SPC" 'projectile-find-file)

(wl/keymap "SPC `" 'vterm)

(wl/keymap "SPC h f" 'helpful-callable)
(wl/keymap "SPC h v" 'helpful-variable)
(wl/keymap "SPC h k" 'helpful-key)
(wl/keymap "SPC h x" 'helpful-command)

(wl/keymap "SPC m m" 'markdown-toggle-markup-hiding)

(wl/keymap "SPC t" 'neotree-toggle)

;; Org & Markdown
(eval-after-load "org"
  '(require 'ox-md nil t))

(use-package markdown-mode
  :ensure t
  :init
  (setq markdown-command "multimarkdown")
  (setq-default markdown-hide-markup t)
  :config
  (setq markdown-enable-wiki-links t
        markdown-hide-markup t
        markdown-fontify-code-blocks-natively t
        markdown-enable-highlighting-syntax t
        markdown-hide-urls t))

;; Just to center the text
(use-package visual-fill-column
  :ensure t
  :init
  (setq-default visual-fill-column-center-text t
                visual-fill-column-width 100))

(defun wl/prepare-text-mode ()
  (visual-fill-column-mode))

;(set-face-font 'markdown-header-face "Source Serif Pro 17")

(add-hook 'text-mode-hook 'wl/prepare-text-mode)

;; RSS & Email
(use-package elfeed
  :ensure t
  :config
  (setq elfeed-feeds
        ;; my own digital garden site feed
        '("https://wiljam144.github.io/digital-garden/rss.xml")))

(require 'mu4e)

(add-hook 'mu4e-compose-pre-hook (lambda () (display-line-numbers-mode -1)))
(setq mail-user-agent 'mu4e-user-agent)
(setq mu4e-drafts-folder "/[Gmail].Drafts")
(setq mu4e-sent-folder "/[Gmail].Sent Mail")
(setq mu4e-trash-folder "/[Gmail].Trash")
(setq mu4e-attachment-dir "~/Downloads")

(setq mu4e-sent-messages-behavior 'delete)

(setq mu4e-get-mail-command "offlineimap")
(setq mu4e-update-interval (* 10 60 60))

(setq user-mail-address wl/mail)

(setq
    user-mail-address wl/mail
    user-full-name wl/name
    mu4e-compose-signature
    (concat
     wl/name
     "\n"
     wl/website))

(require 'smtpmail)
(setq message-send-mail-function 'smtpmail-send-it
      starttls-use-gnutls t
      smtpmail-starttls-credentials '(("smtp.gmail.com" 465 nil nil))
      smtpmail-auth-credentials
        '(("smtp.gmail.com" 465 nil nil))
      smtpmail-stream-type 'ssl
      smtpmail-default-smtp-server "smtp.gmail.com"
      smtpmail-smtp-server "smtp.gmail.com"
      smtpmail-smtp-service 465
      smtpmail-debug-info t)

;; Ligature support
(use-package ligature
  :ensure t
  :config
  ;; Enable the "www" ligature in every possible major mode
  (ligature-set-ligatures 't '("www"))
  ;; Enable traditional ligature support in eww-mode, if the
  ;; `variable-pitch' face supports it
  (ligature-set-ligatures 'eww-mode '("ff" "fi" "ffi"))
  ;; Enable all Cascadia and Fira Code ligatures in programming modes
  (ligature-set-ligatures 'prog-mode
                        '(;; == === ==== => =| =>>=>=|=>==>> ==< =/=//=// =~
                          ;; =:= =!=
                          ("=" (rx (+ (or ">" "<" "|" "/" "~" ":" "!" "="))))
                          ;; ;; ;;;
                          (";" (rx (+ ";")))
                          ;; && &&&
                          ("&" (rx (+ "&")))
                          ;; !! !!! !. !: !!. != !== !~
                          ("!" (rx (+ (or "=" "!" "\." ":" "~"))))
                          ;; ?? ??? ?:  ?=  ?.
                          ("?" (rx (or ":" "=" "\." (+ "?"))))
                          ;; %% %%%
                          ("%" (rx (+ "%")))
                          ;; |> ||> |||> ||||> |] |} || ||| |-> ||-||
                          ;; |->>-||-<<-| |- |== ||=||
                          ;; |==>>==<<==<=>==//==/=!==:===>
                          ("|" (rx (+ (or ">" "<" "|" "/" ":" "!" "}" "\]"
                                          "-" "=" ))))
                          ;; \\ \\\ \/
                          ("\\" (rx (or "/" (+ "\\"))))
                          ;; ++ +++ ++++ +>
                          ("+" (rx (or ">" (+ "+"))))
                          ;; :: ::: :::: :> :< := :// ::=
                          (":" (rx (or ">" "<" "=" "//" ":=" (+ ":"))))
                          ;; // /// //// /\ /* /> /===:===!=//===>>==>==/
                          ("/" (rx (+ (or ">"  "<" "|" "/" "\\" "\*" ":" "!"
                                          "="))))
                          ;; .. ... .... .= .- .? ..= ..<
                          ("\." (rx (or "=" "-" "\?" "\.=" "\.<" (+ "\."))))
                          ;; -- --- ---- -~ -> ->> -| -|->-->>->--<<-|
                          ("-" (rx (+ (or ">" "<" "|" "~" "-"))))
                          ;; *> */ *)  ** *** ****
                          ("*" (rx (or ">" "/" ")" (+ "*"))))
                          ;; www wwww
                          ("w" (rx (+ "w")))
                          ;; <> <!-- <|> <: <~ <~> <~~ <+ <* <$ </  <+> <*>
                          ;; <$> </> <|  <||  <||| <|||| <- <-| <-<<-|-> <->>
                          ;; <<-> <= <=> <<==<<==>=|=>==/==//=!==:=>
                          ;; << <<< <<<<
                          ("<" (rx (+ (or "\+" "\*" "\$" "<" ">" ":" "~"  "!"
                                          "-"  "/" "|" "="))))
                          ;; >: >- >>- >--|-> >>-|-> >= >== >>== >=|=:=>>
                          ;; >> >>> >>>>
                          (">" (rx (+ (or ">" "<" "|" "/" ":" "=" "-"))))
                          ;; #: #= #! #( #? #[ #{ #_ #_( ## ### #####
                          ("#" (rx (or ":" "=" "!" "(" "\?" "\[" "{" "_(" "_"
                                       (+ "#"))))
                          ;; ~~ ~~~ ~=  ~-  ~@ ~> ~~>
                          ("~" (rx (or ">" "=" "-" "@" "~>" (+ "~"))))
                          ;; __ ___ ____ _|_ __|____|_
                          ("_" (rx (+ (or "_" "|"))))
                          ;; Fira code: 0xFF 0x12
                          ("0" (rx (and "x" (+ (in "A-F" "a-f" "0-9")))))
                          ;; Fira code:
                          "Fl"  "Tl"  "fi"  "fj"  "fl"  "ft"
                          ;; The few not covered by the regexps.
                          "{|"  "[|"  "]#"  "(*"  "}#"  "$>"  "^="))
  ;; Enables ligature checks globally in all buffers. You can also do it
  ;; per mode with `ligature-mode'.
  (global-ligature-mode t))
