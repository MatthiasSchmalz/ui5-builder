const AbstractBuilder = require("../AbstractBuilder");
const {getTask} = require("../../tasks/taskRepository");

class ThemeLibraryBuilder extends AbstractBuilder {
	addStandardTasks({resourceCollections, project, log, taskUtil}) {
		this.addTask("replaceCopyright", async () => {
			return getTask("replaceCopyright").task({
				workspace: resourceCollections.workspace,
				options: {
					copyright: project.metadata.copyright,
					pattern: "/resources/**/*.{less,theme}"
				}
			});
		});

		this.addTask("replaceVersion", async () => {
			return getTask("replaceVersion").task({
				workspace: resourceCollections.workspace,
				options: {
					version: project.version,
					pattern: "/resources/**/*.{less,theme}"
				}
			});
		});

		this.addTask("buildThemes", async () => {
			return getTask("buildThemes").task({
				workspace: resourceCollections.workspace,
				dependencies: resourceCollections.dependencies,
				options: {
					projectName: project.metadata.name,
					librariesPattern: !taskUtil.isRootProject() ? "/resources/**/*.library" : undefined,
					themesPattern: !taskUtil.isRootProject() ? "/resources/sap/ui/core/themes/*" : undefined,
					inputPattern: "/resources/**/themes/*/library.source.less"
				}
			});
		});

		this.addTask("generateResourcesJson", () => {
			return getTask("generateResourcesJson").task({
				workspace: resourceCollections.workspace,
				dependencies: resourceCollections.dependencies,
				options: {
					projectName: project.metadata.name
				}
			});
		});
	}
}

module.exports = ThemeLibraryBuilder;
