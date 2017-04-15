class Command {
  constructor(commander, options) {
    this.commander = commander;
    this.object = options.object || null;
    this.description = options.description || 'default description';
    this.action = options.action || {};

    this.builder = this.commander
      .command(this.object)
      .description(this.description);
  }

  addOption(opt) {
    this.builder = this.builder.option(opt);
  }

  execute() {
    return this.builder.action(this.action);
  }
}

class Action {
  constructor(client, config, options) {
    this.client = client || {};
    this.config = config || {};
    this.from = options.from;
    this.url = options.url;
  }

  get() {
    this.client.get(this.url)
    .then(
      (res) => {
        console.log('calling cageur api %s\n%s', this.url, JSON.stringify(res.data, null, 4));
      },
      (err) => console.error(err)
    );
  }

  // TODO: implement create
}

module.exports = { Command, Action };