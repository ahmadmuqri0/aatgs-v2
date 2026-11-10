{
  pkgs,
  ...
}:

{
  packages = with pkgs; [
    tailwindcss-language-server
    emmet-language-server
    vscode-css-languageserver
    vscode-html-languageserver
    svelte-language-server
    playwright-driver.browsers
  ];

  # Nix-built browsers for Vitest browser mode; npm `playwright` must match playwright-driver's version.
  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    lsp.package = pkgs.vtsls;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.typescript = {
    enable = true;
    lsp.package = pkgs.vtsls;
  };

  dotenv.enable = true;

  enterShell = ''
    echo "node $(node --version) · pnpm $(pnpm --version)"
  '';
}
