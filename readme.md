# Setup projeto nodejs utilizando

- Typescript
- Converções de commit de acordo com site conventionalcommits.com \* git-commit-msg-linter
- Padronização Typescript com ESLint seguindo definições do https://standardjs.com/
- Validação dos commits com utilzar husky
- Otimizar validação do ESLint com lint-staged
- Testes unitários com Jest

# Inicializar projeto com package.json

```
npm init -y
```

# Padrão de commit de acordo com conventionalcommits.org

Padronização dos commits
https://www.conventionalcommits.org/en/v1.0.0/

```
<type>: <description>
```

types

- fix: a commit of the type fix patches a bug
- feat: a commit of the type feat introduces a new feature
- outros recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:

Types
API relevant changes
feat Commits, that adds a new feature
fix Commits, that fixes a bug
refactor Commits, that rewrite/restructure your code, however does not change any behaviour
perf Commits are special refactor commits, that improves performance
style Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)
test Commits, that add missing tests or correcting existing tests
docs Commits, that affect documentation only
build Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
ops Commits, that affect operational components like infrastructure, deployment, backup, recovery, ...
chore Miscellaneous commits e.g. modifying .gitignore

# Verificar formato dos commit

Adicionar lib git-commit-msg-linter para validar os commits
https://www.npmjs.com/package/git-commit-msg-linter

```
npm install -D git-commit-msg-linter
```

# Configurar typescript

```
npm install -D typescript @types/node
```

Criar arquivo tsconfig.json para configurar o typecript no projeto

```
{
    "compilerOptions": {
        "outDir": "./dist",
        "module": "commonjs",
        "target": "es2019",
        "esModuleInterop": true, //conversão de modulos que usam require e module.export se usar import
        "allowJs": true //permitir arquivos de configuração em js.
    }
}
```

# Verificar suporte do Nodejs para códigos

https://node.green/

# Configuração do ESLint para validação do Typescript

https://standardjs.com/

Não tem suporte ao typescript, sendo necessário adicionar o ESLint com suporte para o StandandJS.

https://github.com/standard/eslint-config-standard-with-typescript

```
npm install --save-dev eslint@7 eslint-plugin-promise@4 eslint-plugin-import@2 eslint-plugin-node@11 @typescript-eslint/eslint-plugin@4 eslint-config-standard-with-typescript
```

criar arquivo .eslintrc.json e configurar

```
{
    "extends": "standard-with-typescript",
    // "parserOptions": {
    //     "project": "./tsconfig.json" // informa eslint que será usado as configurações do typescript
    // }
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": "off", //Essa regra requer que qualquer expressão booleana seja limitada a booleanos verdadeiros
        "@typescript-eslint/consistent-type-definitions": "off", //Desabilita a regra a que restringe a utilização dos métodos Interfaces e Types simultaneamente em um mesmo projet0
        "@typescript-eslint/comma-spacing": "off",
        "@typescript-eslint/return-await": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-namespace": "off",
        "import/export": "off"
    }
}
```

Adicionar arquivo .eslintignore para ignorar arquivos de node_modules e dist

# Utilzar husky para validar commits

https://typicode.github.io/husky/#/

```
npm install husky --save-dev
```

Editar o package.json > para adicionar um prepare script

```
npm set-script prepare "husky install" && npm run prepare
```

O package.json fica assim após rodar o comando

```
"scripts": {
"prepare": "husky install"
}
```

Adicionr um hook para o lint-staged

```
npx husky add .husky/pre-commit "lint-staged"
```

Adicionar um hook para o executar os testes com jest

```
npx husky add .husky/pre-commit "npm test"
```

# Valiar arquivos em staged com lint lint-staged

Podemos utilizar o kusky com o lint para validar os arquivos em stage. Para isto é necessario adicionar a lib a lint-staged.

Quando o número de arquivos aumenta o build se torna lento se for validar todos os aquivos do /src. Com o lint-staged irá rodar script apenas nos arquivos modificados ou na stage area do git.

```
npm install lint-staged --save-dev
```

Criar arquivo .lintstagedrc.json e configurar
{
"\*.ts": [
//lint-staged vai rodar o eslint no src e realizará um fix automatico se necessário
"eslint 'src/**' --fix",
//se estiver correto vai realizar um add
"git add"
]
}

# Instalação do jest para testes

```
npm install jest --save-dev
npm install @types/jest --save-dev
npm install ts-node --save-dev
```

Iniciar jest

```
jest --init
```

# Arquitetura

Padrão adapter
Padrão composite
Padrão inversão de dependencia
Desacoplamento usando inversão de dependência
