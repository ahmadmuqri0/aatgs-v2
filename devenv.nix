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
  ];

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

  enterShell = ''
    echo "node $(node --version) · pnpm $(pnpm --version)"
  '';
}
