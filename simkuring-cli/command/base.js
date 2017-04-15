// Base class for command abstraction
// This class is a thin wrapper on top of commander library
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

// Base class for action abstraction
// This class interfaces for specific command action
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
        console.log(JSON.stringify(res.data, null, 4));
      },
      (err) => console.error(err)
    );
  }

  // TODO: implement create
}

module.exports = { Command, Action };