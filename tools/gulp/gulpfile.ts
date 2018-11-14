import {createPackageBuildTasks} from 'material2-build-tools';
import {
  cdkPackage,
  cdkExperimentalPackage,
  examplesPackage,
  materialExperimentalPackage,
  materialPackage,
  momentAdapterPackage
} from './packages';

createPackageBuildTasks(cdkPackage);
createPackageBuildTasks(cdkExperimentalPackage);
createPackageBuildTasks(materialPackage);
createPackageBuildTasks(materialExperimentalPackage);
createPackageBuildTasks(examplesPackage, ['build-examples-module']);
createPackageBuildTasks(momentAdapterPackage);

import './tasks/aot';
import './tasks/breaking-changes';
import './tasks/changelog';
import './tasks/ci';
import './tasks/clean';
import './tasks/default';
import './tasks/development';
import './tasks/docs';
import './tasks/e2e';
import './tasks/example-module';
import './tasks/lint';
import './tasks/material-release';
import './tasks/unit-test';
import './tasks/universal';

import './tasks/publish/publish-task';
import './tasks/publish/sanity-checks';
import './tasks/publish/validate-release';
