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
import {addClass, removeClass} from './classes';
import {camera, VIDEO_PIXELS} from './camera';
import {isMobile, isChromeIOS} from './utils';
import {MobileNet} from './mobilenet'

export const VIEWS = {
  LOADING: 'loading',
  QUIT: 'quit',
  CAMERA: 'camera',
  LANDING: 'landing'
}

interface CameraDimentions {
  [index: number]: number;
}

const SELECTORS = {
  VIEWS_LOADING: '.view__loading--js',
  VIEWS_QUIT: '.view__quit--js',
  VIEWS_ABOUT: '.view__about--js',
  VIEWS_LANDING: '.view__landing--js',
  VIEWS_CAMERA: '.view__camera--js',
  VIEWS_COUNTDOWN: '.view__countdown--js',
  VIEWS_COUNTDOWN3: '.view__countdown__3--js',
  VIEWS_COUNTDOWN2: '.view__countdown__2--js',
  VIEWS_COUNTDOWN1: '.view__countdown__1--js',
  VIEWS_COUNTDOWN0: '.view__countdown__0--js',
  VIEWS_SLEUTH: '.view__sleuth--js',
  VIEWS_FOUND_X_ITEMS: '.view__found-x-items--js',
  VIEWS_FOUND_NO_ITEMS: '.view__found-no-items--js',
  VIEWS_FOUND_ALL_ITEMS: '.view__found-all-items--js',
  VIEWS_FOUND_ITEM: '.view__found-item--js',
  PREDICTION_RESULTS_EL: '.view__camera__prediction-results--js',
  START_GAME_BTN: '.landing__play-btn--js',
  REPLAY_GAME_BTN: '.play-again-btn--js',
  CLOSE_BTN: '.view__info-bar__close-btn--js',
  ABOUT_BTN: '.view__info-bar__about-btn--js',
  HOME_BTN: '.view__info-bar__home-btn--js',
  CAMERA_QUIT_BTN: '.view__camera__quit-btn--js',
  QUIT_CANCEL_BTN: '.quit-cancel-btn--js',
  QUIT_BTN: '.quit-btn--js',
  NEXT_EMOJI_BTN: '.next-emoji-btn--js',
  SLEUTH_EMOJI: '.view__sleuth__emoji--js',
  SLEUTH_SPEAKING_EL: '.view__sleuth__speaking--js',
  STATUS_BAR_EMOJI_EL: '.view__status-bar__find__emoji--js',
  COUNTDOWN_EMOJI_EL: '.view__countdown__0__emoji--js',
  CAMERA_FLASH_EL: '.camera__capture-flash--js',
  CAMERA_CAPTURE_EL: '.camera__capture-wrapper--js',
  CAMERA_DESKTOP_MSG_EL: '.view__camera__desktop-msg',
  TIMER_EL: '.view__status-bar__info__timer--js',
  TIMER_FLASH_EL: '.view__status-bar__info__timer-flash--js',
  TIMER_COUNTDOWN_EL: '.view__countdown__0__find-time-val--js',
  SCORE_EL: '.view__status-bar__info__score--js',
  NR_FOUND_EL: '.view__found-x-items__nr-found--js',
  NR_MAX_FOUND_EL: '.view__found-all-items__nr-found--js',
  EMOJI_FOUND_LIST: '.view__found-x-items__emojis--js',
  EMOJI_MAX_FOUND_LIST: '.view__found-all-items__emojis--js',
  LANDING_DESKTOP_MSG_EL: '.view__landing__desktop-msg--js',
  LANDING_PLATFORM_MSG_EL: '.view__landing__platform-msg--js',
  LANDING_INFO_MSG_EL: '.view__landing__intro--js',
  AGE_DISCLAIMER_MSG_EL: '.view__landing__age-msg--js',
  CAMERA_FPS_EL: '.view__camera__fps--js',
  LANG_SELECTOR_EL: '.view__landing__lang-selector',
};

export interface ViewsListTypes {
  [index: string]: HTMLElement;
}

export class Ui {
  mobileNet:MobileNet;

  viewsList: ViewsListTypes;
  startGameBtn: HTMLButtonElement;
  predictionResultsEl: HTMLElement;
  replayGameBtns: NodeListOf<Element>;
  homeBtns: NodeListOf<Element>;
  aboutBtns: NodeListOf<Element>;
  cameraQuitBtn: HTMLElement;
  quitCancelBtn: HTMLElement;
  quitBtn: HTMLElement;
  cameraFlashEl: HTMLElement;
  cameraCaptureEl: HTMLElement;
  cameraDesktopMsgEl: HTMLElement;
  timerEl: HTMLElement;
  timerFlashEl: HTMLElement;
  timerCountdownEl: HTMLElement;
  scoreEl: HTMLElement;
  landingDesktopMsgEl: HTMLElement;
  landingPlatformMsgEl: HTMLElement;
  landingInfoMsgEl: HTMLElement;
  ageDisclaimerMsgEl: HTMLElement;
  cameraFPSEl: HTMLElement;
  langSelectorEl: HTMLElement;
  sleuthSpeakingPrefixes: Array<string>;
  activeView: string;
  prevActiveView: string;

  constructor() {
    this.mobileNet = new MobileNet();
    this.viewsList = {
      [VIEWS.LOADING]: document.querySelector(SELECTORS.VIEWS_LOADING),
      [VIEWS.QUIT]: document.querySelector(SELECTORS.VIEWS_QUIT),
      [VIEWS.LANDING]: document.querySelector(SELECTORS.VIEWS_LANDING),
      [VIEWS.CAMERA]: document.querySelector(SELECTORS.VIEWS_CAMERA)
    };

    this.startGameBtn = document.querySelector(SELECTORS.START_GAME_BTN);
    this.replayGameBtns = document.querySelectorAll(SELECTORS.REPLAY_GAME_BTN);
    this.homeBtns = document.querySelectorAll(SELECTORS.HOME_BTN);
    this.cameraQuitBtn = document.querySelector(SELECTORS.CAMERA_QUIT_BTN);
    this.quitCancelBtn = document.querySelector(SELECTORS.QUIT_CANCEL_BTN);
    this.quitBtn = document.querySelector(SELECTORS.QUIT_BTN);
    this.cameraFlashEl = document.querySelector(SELECTORS.CAMERA_FLASH_EL);
    this.cameraCaptureEl = document.querySelector(SELECTORS.CAMERA_CAPTURE_EL);
    this.cameraDesktopMsgEl =
        document.querySelector(SELECTORS.CAMERA_DESKTOP_MSG_EL);
    this.timerEl = document.querySelector(SELECTORS.TIMER_EL);
    this.timerFlashEl = document.querySelector(SELECTORS.TIMER_FLASH_EL);
    this.timerCountdownEl =
        document.querySelector(SELECTORS.TIMER_COUNTDOWN_EL);
    this.scoreEl = document.querySelector(SELECTORS.SCORE_EL);
    this.predictionResultsEl =
        document.querySelector(SELECTORS.PREDICTION_RESULTS_EL);
    this.landingDesktopMsgEl =
        document.querySelector(SELECTORS.LANDING_DESKTOP_MSG_EL);
    this.landingPlatformMsgEl =
        document.querySelector(SELECTORS.LANDING_PLATFORM_MSG_EL);
    this.landingInfoMsgEl =
        document.querySelector(SELECTORS.LANDING_INFO_MSG_EL);
    this.ageDisclaimerMsgEl =
        document.querySelector(SELECTORS.AGE_DISCLAIMER_MSG_EL);
    this.cameraFPSEl = document.querySelector(SELECTORS.CAMERA_FPS_EL);
    this.langSelectorEl = document.querySelector(SELECTORS.LANG_SELECTOR_EL);

    this.activeView = VIEWS.LANDING;
    this.prevActiveView = this.activeView;
  }

  /**
   * Initialize the UI by checking the platform the game is running on and
   * registering events.
   */
  init() {
    this.setPlatformMessages();
    //this.setCameraFacing();
    this.addEvents();
    this.startGameBtn.style.display = "block";
  }

  async predict() {
      const result = tfc.tidy(() => {
        const pixels = tfc.browser.fromPixels(camera.videoElement);
        const centerHeight = pixels.shape[0] / 2;
        const beginHeight = centerHeight - (VIDEO_PIXELS / 2);
        const centerWidth = pixels.shape[1] / 2;
        const beginWidth = centerWidth - (VIDEO_PIXELS / 2);
        const pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [VIDEO_PIXELS, VIDEO_PIXELS, 3]).cast("float32");
        return this.mobileNet.predict(pixelsCropped);
      });
      const values = result.dataSync();
      result.dispose();
      const val = values[1];
      this.predictionResultsEl.innerText = val.toString();
      if(val > 0.8){
        removeClass(this.viewsList[VIEWS.CAMERA], 'black-border');
        addClass(this.viewsList[VIEWS.CAMERA], 'red-border');
      }else{
        removeClass(this.viewsList[VIEWS.CAMERA], 'red-border');
        addClass(this.viewsList[VIEWS.CAMERA], 'black-border');
      }
      // To ensure better page responsiveness we call our predict function via
      // requestAnimationFrame - see goo.gl/1d9cJa
      requestAnimationFrame(() => this.predict());
  }

  /**
   * Sets various messages related to platform support and info relating to
   * the game being best experienced on mobile.
   */
  setPlatformMessages() {
    if (isMobile()) {
      if (isChromeIOS()) {
        this.startGameBtn.disabled = true;
        addClass(this.viewsList[VIEWS.LANDING], 'not-supported');
        //this.landingPlatformMsgEl.style.display = 'block';
        //this.ageDisclaimerMsgEl.style.display = 'none';
      }
    } else {
      //this.landingDesktopMsgEl.style.display = 'block';
      //this.cameraDesktopMsgEl.style.display = 'block';
    }
  }

  /**
   * If the game is played on desktop we flip the camera assuming the front
   * facing camera is used on desktop.
   */
  setCameraFacing() {
    if (!isMobile()) {
      camera.setFrontFacingCamera();
    }
  }

  warmUpModel() {
    this.mobileNet.predict(
        tfc.zeros([VIDEO_PIXELS, VIDEO_PIXELS, 3]));
  }

  /**
   * Registers various UI events for buttons.
   */
  addEvents() {
    if (this.startGameBtn) {
      this.startGameBtn.addEventListener('click', () => {
        this.startGameBtn.style.display = "none";
        this.mobileNet.load().then(() => 
        {
          this.warmUpModel();
          camera.setupCamera().then((value: CameraDimentions) => {
            camera.setupVideoDimensions(value[0], value[1]);
            camera.unPauseCamera();
            this.hideView(VIEWS.LANDING);
            this.showView(VIEWS.CAMERA);
            this.predict();
          });
        });
      });
    }


    if (this.cameraQuitBtn) {
      this.cameraQuitBtn.addEventListener('click', () => {
      });
    }

    if (this.quitCancelBtn) {
      this.quitCancelBtn.addEventListener('click', () => {
      });
    }

    if (this.quitBtn) {
      this.quitBtn.addEventListener('click', () => {
      });
    }

  }


  /**
   * Sets the active UI view.
   * @param view The view to set as the active view.
   */
  setActiveView(view: string) {
    this.prevActiveView = this.activeView;
    this.activeView = view;
  }

  /**
   * Hides a UI view.
   * @param view The view to hide.
   */
  hideView(view: string) {
    this.viewsList[view].style.display = 'none';
    this.activeView = this.prevActiveView;
  }

  /**
   * Shows a UI view.
   * @param view The view to show.
   */
  showView(view: string) {
    this.viewsList[view].style.display = 'flex';
    this.prevActiveView = this.activeView;
    this.activeView = view;
  }

  
}

export let ui = new Ui();
