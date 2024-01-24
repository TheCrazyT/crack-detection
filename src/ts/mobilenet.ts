/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tfc from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';

type TensorMap = {[name: string]: tfc.Tensor};

const MODEL_FILE_URL = './model/model.json';
const INPUT_NODE_NAME = 'MobilenetV3large_input';
const OUTPUT_NODE_NAME = 'Identity:0';


export class MobileNet {

  model: tf.GraphModel;

  async load() {
    /*this.model = await tf.loadLayersModel(
      MODEL_FILE_URL
    );*/
    this.model = await loadGraphModel(
      MODEL_FILE_URL
    );
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
  /**
   * Infer through MobileNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The softmax logits.
   */
  predict(input: tfc.Tensor): tfc.Tensor1D {
    const preprocessedInput = input;/* tfc.div(
        tfc.sub(input.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR);*/
    const reshapedInput = tf.reshape(preprocessedInput,[1, ...preprocessedInput.shape]);
    const dict: TensorMap = {};
    dict[INPUT_NODE_NAME] = reshapedInput;
    return this.model.execute(dict, OUTPUT_NODE_NAME) as tfc.Tensor1D;
  }

}
