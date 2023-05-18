## Migração de banco de dados

Abaixo está o script que deve ser colocado no campo **Pre-Deploy Script** da aba **App Configs** no CapRover.

\* *A configuração do script só deve ser feita APÓS o primeiro build do projeto. Isso é necessário porque o comando que é executado para migração está contido dentro do container do projeto da API.*

```js
async function preDeployFunction(captainAppObject, dockerUpdateObject) {
  const DockerApi = require('./built/docker/DockerApi');
  const api = new DockerApi.default();

  async function runContainer(args) {
    const imageName = dockerUpdateObject.TaskTemplate.ContainerSpec.Image;

    const env = captainAppObject.envVars.map(kv => kv.key + '=' + kv.value);
    const config = {
      Env: env,
      HostConfig: {
        AutoRemove: true,
        NetworkMode: captainAppObject.networks[0],
        Binds: captainAppObject.volumes.map(vol => `${vol.hostPath}:${vol.containerPath}`)
      }
    };

    const [output] = await api.dockerode.run(imageName, args, process.stdout, config);
    if (output.StatusCode !== 0) {
      throw new Error(`Failed to run image ${imageName} with args ${args} (status code ${output.StatusCode}).`);
    }
  };

  const service = api.dockerode.getService(dockerUpdateObject.Name);
  await runContainer(['sh', '-c', './node_modules/.bin/knex migrate:latest --knexfile ./dist/database/knexfile.js']);

  dockerUpdateObject.version = await service.inspect().then(result => result.Version.Index);
  return dockerUpdateObject;
};
```

**Usuário para migração**

O usuário que será utilizado na migração do banco de dados precisa acesso completo ao banco de dados que será migrado, além da permissão `SESSION_VARIABLES_ADMIN`. Veja abaixo os comandos para criar e conceder permissão para o usuário:

```sql
CREATE USER '<username>' IDENTIFIED WITH caching_sha2_password BY '<password>';
GRANT ALL PRIVILEGED ON '<database>'.* TO '<username>'@'%';
GRANT SESSION_VARIABLES_ADMIN ON *.* TO '<username>'@'%';
```

Após a criação do usuário, configure nas variáveis no projeto:

```properties
MYSQL_MIGRATION_USERNAME=<username>
MYSQL_MIGRATION_PASSWORD=<password>
```

## Arquivos de upload

O CapRover por padrão já possui um container com NGINX configurado, para que possamos utilizar ele para servir os arquivos/imagens do sistema a regra abaixo deve ser respeitada.

Para que o NGINX consiga enxergar os arquivos na máquina host é necessários que os arquivos estejam dentro do diretório `/captain/data/nginx-shared`. Os diretórios e arquivos contidos neste diretório da máquina host serão mapeados para o diretório `/nginx-shared` dentro do container Docker.

**Configuração do NGINX para o projeto de API (`hcf-api`)**

A configuração do NGINX do projeto contém as duas diretivas `location` abaixo:

```bash
# Crop images using NGINX image module
location ~ ^/images/crop/(?<width>\d+)/(?<height>\d+)/(?<file_path>.+)$ {
  alias <%- '/nginx-shared/' + s.localDomain + '/uploads/$file_path' %>;
  image_filter crop $width $height;
  image_filter_jpeg_quality 90;
  image_filter_buffer 8M;
}

# Resize images using NGINX image module
location ~ ^/images/(?<width>\d+)/(?<file_path>.+)$ {
  alias <%- '/nginx-shared/' + s.localDomain + '/uploads/$file_path' %>;
  image_filter resize $width -;
  image_filter_jpeg_quality 90;
  image_filter_buffer 8M;
}

# Serve uploads folder
location ~ ^/images/(?<file_path>.+)$ {
  alias <%- '/nginx-shared/' + s.localDomain + '/uploads/$file_path' %>;
}
```

\* *ATENÇÃO: O uso do módulo `image_filter` dentro do arquivo do NGINX requer de o módulo seja previamente carregado. Isso feito foi adicionando a linha `load_module /etc/nginx/modules/ngx_http_image_filter_module.so;` no arquivo principal de configuração do NGINX no CapRover (menu **Settings**, seção **NGINX Configurations**).*

O uso de variáveis (como `s.localDomain`) dentro do arquivo do NGINX é exclusivo do CapRover, que faz a execução de um script para substituição de valores antes de disposibilizar o arquivo para o NGINX de fato.

A variável `s.localDoamin` usada na diretiva `alias` contém o nome do domínio local do serviço da API no CapRover, neste caso `srv-captain--hcf-api`. O prefixo `srv-captain--` é padrão para todos os serviços, e o restante é o exato nome do aplicativo criado no painel.

O que dizemos doi então criar um diretório com o mesmo nome do domínio local dentro do diretório `/captain/data/nginx-shared`, ficando o caminho completo como `/captain/data/nginx-shared/srv-captain--hcf-api/uploads`. Dentro do container do NGINX então o diretório mapeado fica como `/nginx-shared/srv-captain--hcf-api/uploads`, como feito nas duas diretivas `alias` dentro de `location`.

\* *As duas configuração são para permitir o redimensionamento das imagens, geralmente utilizadas em locais onde contém um preview da imagem, que não há necessidade de carregar a imagem em tamanho original.*
