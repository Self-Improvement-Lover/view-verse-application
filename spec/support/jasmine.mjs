console.log('Loaded test file - all is well, well is all. the world is round and round is the world.');
import Jasmine from 'jasmine';
import babelRegister from '@babel/register';
import 'ts-node/register';

const jasmine = new Jasmine();

babelRegister({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignore: [/node_modules/],
});

jasmine.loadConfig({
  spec_dir: './spec', // Transpiled spec files*
  spec_files: ['**/*.test.ts'], // Adjust for transpiled extensions
  helpers: ['dist/helpers/**/*.js'], // Transpiled helper files
  stopSpecOnExpectationFailure: false,
});

export default {
  spec_dir: './spec', // Update based on your folder structure
  spec_files: ['**/*[sS]pec.?(m)js', '**/spec.?tsx', '**/*test.mjs', '**/*test.tsx', 'spec/app.spec.tsx'],
  helpers: ['helpers/**/*.?(m)js', '../node_modules/ts-node/register'],
  stopSpecOnExpectationFailure: false,
  random: false,
};

jasmine.execute();
//jasmine.execute([], 'verbose');



