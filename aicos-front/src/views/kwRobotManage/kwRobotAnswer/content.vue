<template>
  <div>
    <template v-for="item in message">
      <template v-if="item.calltype === 'in'">
        <div class="aicc-chart-item" :key="item.id">
          <div class="aicc-visitors-right">
            <img :src="kehuImg" class="aicc-avatar-img" />
            <div class="aicc-charting-container clearfix">
              <div class="aicc-charting-wrap">
                <!-- <p class="charting-message">
                  <span id="aiccSysRobotName" class="charting-name">我</span>
                  <span class="charting-time"> {{ item.createtime }}</span>
                </p> -->
                <div class="charting-content-wrap">
                  <div
                    class="charting-content"
                    relrobot="aiccSysRobotBg"
                    reltheme="aiccSysTheme"
                    aicctype="background"
                  >
                    <div
                      class="aicc-welcome-text"
                      rel="visitorTextInfo"
                      v-html="item.message"
                    ></div>
                  </div>
                </div>
                <div class="charting-setting">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="$t('kwRobotAnswer.knowledgeAnnotation')"
                    placement="bottom"
                  >
                    <el-button
                      icon="el-icon-edit"
                      size="mini"
                      @click="knowledgeMarker(item)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="$t('kwRobotAnswer.creatingKnowledge')"
                    placement="bottom"
                  >
                    <el-button
                      icon="el-icon-plus"
                      size="mini"
                      @click="createFun(item)"
                    ></el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="aicc-chart-item" :key="item.id">
          <div class="aicc-robot-left">
            <img :src="kefuImg" class="aicc-avatar-img" />
            <div class="aicc-charting-container clearfix">
              <div class="aicc-charting-wrap">
                <!-- <p class="charting-message">
                  <span id="aiccSysRobotName" class="charting-name">
                    {{ selectRobotName }}
                  </span>
                  <span class="charting-time">
                    {{ item.createtime }}
                  </span>
                </p> -->
                <div class="charting-content-wrap">
                  <div
                    class="charting-content"
                    relrobot="aiccSysRobotBg"
                    reltheme="aiccSysTheme"
                    aicctype="background"
                  >
                    <div class="aicc-text-outer" rel="aiccTextOuter">
                      <div
                        class="aicc-text-inner"
                        rel="aiccTextInner"
                        maxHeight="90"
                      >
                        <template v-if="item.selectorName !== 'AiSearch'">
                          <div
                            class="aicc-welcome-text"
                            rel="aiccText"
                            v-if="!item.response.unknownShow"
                          >
                            <!-- {{ robotContentHtml }} -->
                            <!-- <p style="font-size: 12px">
                            {{ item.response.intentResponseKey }}
                            :<span style="font-weight: bolder; font-size: 13px">
                              {{
                                Math.floor(
                                  Number(item.response.confidence) * 100
                                ) / 100
                              }}
                            </span>
                          </p> -->

                            <template v-if="item.selectorName === 'table'">
                              <div>
                                <template
                                  v-if="item.response.tableAnswer.match"
                                >
                                  <el-tabs v-model="tableActiveName">
                                    <el-tab-pane
                                      v-for="arr2 in item.response.tableAnswer
                                        .answer.answer"
                                      :key="arr2.code"
                                      :label="arr2.columName"
                                      style="padding-left: 15px"
                                      class="aicc-table-item"
                                    >
                                      <template
                                        v-if="
                                          arr2.content === '' ||
                                            arr2.content === '[]'
                                        "
                                      >
                                        <div>
                                          {{ $t("kwRobotAnswer.notHave") }}
                                        </div>
                                      </template>
                                      <template v-else>
                                        <template
                                          v-if="
                                            arr2.code === 'extendField9' ||
                                              arr2.code === 'extendField10'
                                          "
                                        >
                                          <p>
                                            <a
                                              :href="arr2.content"
                                              target="_blank"
                                              style=""
                                            >
                                              {{ arr2.content }}
                                            </a>
                                          </p>
                                        </template>
                                        <template v-else>
                                          <template
                                            v-if="
                                              arr2.displayType === '8' ||
                                                arr2.displayType === '9'
                                            "
                                          >
                                            <p
                                              v-for="arr3 in JSON.parse(
                                                arr2.content
                                              )"
                                              :key="arr3.value"
                                            >
                                              <a :href="arr3.value" download>
                                                {{ arr3.label }}
                                              </a>
                                            </p>
                                          </template>
                                          <template
                                            v-else-if="arr2.displayType === '3'"
                                          >
                                            <div>
                                              {{
                                                JSON.parse(arr2.content).name
                                              }}
                                            </div>

                                            <p
                                              v-for="arr3 in JSON.parse(
                                                arr2.content
                                              ).file"
                                              :key="arr3.value"
                                            >
                                              <a :href="arr3.value" download>
                                                {{ arr3.label }}
                                              </a>
                                            </p>
                                          </template>
                                          <template
                                            v-else-if="
                                              arr2.displayType === '10'
                                            "
                                          >
                                            <div
                                              class="aicc-table-content"
                                              style="max-height: 260px"
                                              v-html="arr2.content"
                                            ></div>
                                          </template>
                                          <template v-else>
                                            <div>
                                              {{ arr2.content }}
                                            </div>
                                          </template>
                                        </template>
                                      </template>
                                    </el-tab-pane>
                                  </el-tabs>
                                </template>
                                <template v-else>
                                  {{ item.response.tableAnswer.answer.answer }}
                                </template>
                                <template
                                  v-if="
                                    item.response.tableAnswer.answer.type !==
                                      'NO_MATCH'
                                  "
                                >
                                  <div class="faqAnswerAll">
                                    <span
                                      style="font-size: 14px; font-weight: 600"
                                      >{{ $t("kwRobotAnswer.allAnswer") }}</span
                                    >
                                  </div>
                                  <el-collapse
                                    v-model="activeNames"
                                    @change="handleChange"
                                    class="aicc-table-item"
                                  >
                                    <el-collapse-item
                                      v-for="arr in item.response.tableAnswer
                                        .tables[0].rows[0].angleDTOList"
                                      :key="arr.angleName"
                                      :title="arr.angleName"
                                      :name="arr.angleName"
                                    >
                                      <template
                                        v-if="item.response.tableAnswer.match"
                                      >
                                        <el-tabs v-model="tableActiveName">
                                          <el-tab-pane
                                            v-for="arr2 in arr.columDTOList"
                                            :key="arr2.code"
                                            :label="arr2.columName"
                                            style="padding-left: 15px"
                                          >
                                            <template
                                              v-if="
                                                arr2.content === '' ||
                                                  arr2.content === '[]'
                                              "
                                            >
                                              <div>
                                                {{
                                                  $t("kwRobotAnswer.notHave")
                                                }}
                                              </div>
                                            </template>
                                            <template v-else>
                                              <template
                                                v-if="
                                                  arr2.code ===
                                                    'extendField9' ||
                                                    arr2.code ===
                                                      'extendField10'
                                                "
                                              >
                                                <p>
                                                  <a
                                                    :href="arr2.content"
                                                    target="_blank"
                                                    style=""
                                                  >
                                                    {{ arr2.content }}
                                                  </a>
                                                </p>
                                              </template>
                                              <template v-else>
                                                <template
                                                  v-if="
                                                    arr2.displayType === '8' ||
                                                      arr2.displayType === '9'
                                                  "
                                                >
                                                  <p
                                                    v-for="arr3 in JSON.parse(
                                                      arr2.content
                                                    )"
                                                    :key="arr3.value"
                                                  >
                                                    <a
                                                      :href="arr3.value"
                                                      download
                                                    >
                                                      {{ arr3.label }}
                                                    </a>
                                                  </p>
                                                </template>
                                                <template
                                                  v-else-if="
                                                    arr2.displayType === '3'
                                                  "
                                                >
                                                  <div>
                                                    {{
                                                      JSON.parse(arr2.content)
                                                        .name
                                                    }}
                                                  </div>

                                                  <p
                                                    v-for="arr3 in JSON.parse(
                                                      arr2.content
                                                    ).file"
                                                    :key="arr3.value"
                                                  >
                                                    <a
                                                      :href="arr3.value"
                                                      download
                                                    >
                                                      {{ arr3.label }}
                                                    </a>
                                                  </p>
                                                </template>
                                                <template
                                                  v-else-if="
                                                    arr2.displayType === '10'
                                                  "
                                                >
                                                  <div
                                                    class="aicc-table-content"
                                                    v-html="arr2.content"
                                                  ></div>
                                                </template>
                                                <template v-else>
                                                  <div>
                                                    {{ arr2.content }}
                                                  </div>
                                                </template>
                                              </template>
                                            </template>
                                          </el-tab-pane>
                                        </el-tabs>
                                      </template>
                                      <template v-else>
                                        {{
                                          item.response.tableAnswer.answer
                                            .answer
                                        }}
                                      </template>
                                    </el-collapse-item>
                                  </el-collapse>
                                </template>
                              </div>
                            </template>
                            <template v-else>
                              <template
                                v-if="!validatenull(item.response.responses)"
                              >
                                <div class="faqContent">
                                  <template
                                    v-if="
                                      item.response.knowledgeFlag &&
                                        item.response.responses.length > 1
                                    "
                                  >
                                    <el-collapse v-model="activeName">
                                      <el-collapse-item
                                        v-for="item2 in JSON.parse(
                                          item.response.responses[1]
                                            .multiModalTracks[0].text
                                        )"
                                        :key="item2.id"
                                        :name="item2.id"
                                      >
                                        <template slot="title">
                                          <template
                                            v-if="item2.angle.length > 0"
                                          >
                                            <span
                                              v-for="(item3, i) in item2.angle"
                                              :key="item3.cateName + 1"
                                              >{{ item3.cateName }}:{{
                                                item3.name
                                              }}<template
                                                v-if="
                                                  i < item2.angle.length - 1
                                                "
                                                >、</template
                                              ></span
                                            >
                                          </template>
                                          <template v-else>
                                            {{
                                              $t(
                                                "kwRobotAnswer.universalPerspective"
                                              )
                                            }}
                                          </template>
                                        </template>
                                        <div v-html="item2.content"></div>
                                      </el-collapse-item>
                                    </el-collapse>
                                  </template>
                                  <template v-else>
                                    <template
                                      v-if="
                                        item.response.responses[1]
                                          .multiModalTracks[0].multiModalCmd ===
                                          'HANGUP'
                                      "
                                    >
                                      <div>流程结束</div>
                                    </template>
                                    <template v-else>
                                      <div
                                        v-html="
                                          item.response.responses[1]
                                            .multiModalTracks[0].text
                                        "
                                      ></div>
                                    </template>
                                  </template>
                                </div>
                                <template
                                  v-if="!validatenull(item.response.faqAnswer)"
                                >
                                  <div>
                                    <div class="faqAnswerAll">
                                      <span
                                        style="font-size: 14px; font-weight: 600"
                                        >{{
                                          $t("kwRobotAnswer.allAnswer")
                                        }}</span
                                      >
                                      <!-- <el-button
                                      class="moreBtn el-icon-arrow-down"
                                      type="text"
                                      v-if="
                                        !item.faqAnswerShow &&
                                        JSON.parse(item.response.faqAnswer)
                                          .length > 5
                                      "
                                      @click="faqMoreClick(item)"
                                    >
                                      展开
                                    </el-button> -->
                                    </div>
                                  </div>
                                  <div>
                                    <template
                                      v-if="
                                        !item.faqAnswerShow &&
                                          JSON.parse(item.response.faqAnswer)
                                            .length > 5
                                      "
                                    >
                                      <ul>
                                        <template
                                          v-for="(item7, i) in JSON.parse(
                                            item.response.faqAnswer
                                          )"
                                        >
                                          <li
                                            v-if="i <= 4"
                                            :key="item7.question"
                                            @click="
                                              recommendClick(item7.question)
                                            "
                                          >
                                            <template
                                              v-if="item7.angle.length > 0"
                                            >
                                              <span
                                                v-for="(item8,
                                                e) in item7.angle"
                                                :key="item8.cateName + e"
                                                >{{ item8.cateName }}:{{
                                                  item8.name
                                                }}<template
                                                  v-if="
                                                    e < item7.angle.length - 1
                                                  "
                                                  >、</template
                                                ></span
                                              >
                                            </template>
                                            <template v-else>
                                              {{
                                                $t(
                                                  "kwRobotAnswer.universalPerspective"
                                                )
                                              }}
                                            </template>
                                            <div v-html="item7.content"></div>
                                          </li>
                                        </template>
                                      </ul>
                                    </template>
                                    <template v-else>
                                      <el-collapse v-model="activeName">
                                        <el-collapse-item
                                          v-for="item7 in JSON.parse(
                                            item.response.faqAnswer
                                          )"
                                          :key="item7.id"
                                          :name="item7.id"
                                        >
                                          <template slot="title">
                                            <template
                                              v-if="item7.angle.length > 0"
                                            >
                                              <span
                                                v-for="(item8,
                                                i) in item7.angle"
                                                :key="item8.cateName"
                                                >{{ item8.cateName }}:{{
                                                  item8.name
                                                }}<template
                                                  v-if="
                                                    i < item7.angle.length - 1
                                                  "
                                                  >、</template
                                                ></span
                                              >
                                            </template>
                                            <template v-else>
                                              {{
                                                $t(
                                                  "kwRobotAnswer.universalPerspective"
                                                )
                                              }}
                                            </template>
                                          </template>
                                          <div v-html="item7.content"></div>
                                        </el-collapse-item>
                                      </el-collapse>
                                    </template>
                                  </div>
                                </template>
                              </template>
                              <template
                                v-if="
                                  !validatenull(item.response.followTags) &&
                                    item.selectorName === 'topic'
                                "
                              >
                                <h5 style="margin: 0px">
                                  {{ $t("kwRobotAnswer.selectQuestion") }}：
                                </h5>
                                <div
                                  style="
                                  max-height: 300px;
                                  overflow-y: auto;
                                  padding: 5px;
                                "
                                >
                                  <el-button
                                    round
                                    size="small"
                                    style="margin-bottom: 8px"
                                    v-for="item4 in item.response.followTags"
                                    :key="item4.followIntentId"
                                    @click="followClick(item4.displayTag)"
                                  >
                                    {{ item4.followTags.split("/")[0] }}
                                  </el-button>
                                </div>
                                <!-- <ul
                                style="
                                  background-color: #edecec;
                                  border-radius: 5px;
                                  padding-left: 10px;
                                "
                              >
                                <li
                                  v-for="item4 in item.response.followTags"
                                  :key="item4.followIntentId"
                                  @click="followClick(item4.followIntentName)"
                                  style="text-decoration: underline"
                                >
                                  {{ item4.followIntentName }}
                                </li>
                              </ul> -->
                              </template>
                            </template>

                            <template
                              v-if="
                                item.selectorName === 'topic' &&
                                  !item.response.isRelatedKnowledge &&
                                  validatenull(item.response.gotoFlowMark) &&
                                  validatenull(item.response.followTags)
                              "
                            >
                              <div>
                                {{ $t("kwRobotAnswer.intentionUnder") }}
                                <el-button
                                  type="text"
                                  @click="
                                    editClick(
                                      item.response.debugInfo.knowledgeId
                                    )
                                  "
                                  >{{
                                    $t("kwRobotAnswer.clickHere")
                                  }}</el-button
                                >
                              </div>
                            </template>
                            <template v-else>
                              <template
                                v-if="
                                  validatenull(item.response.followTags) &&
                                    !validatenull(
                                      item.response.recommendQuestions
                                    )
                                "
                              >
                                <template
                                  v-if="
                                    item.selectorName === 'topic' &&
                                      item.response.isRelatedKnowledge
                                  "
                                >
                                  <el-tabs v-model="topicActiveName">
                                    <el-tab-pane
                                      label="FAQ"
                                      v-if="
                                        !validatenull(
                                          item.faqRecommendQuestions
                                        )
                                      "
                                    >
                                      <template
                                        v-if="
                                          item.faqRecommendQuestions.length > 5
                                        "
                                      >
                                        <div
                                          class="topicQuestionModule"
                                          v-if="!item.faqShow"
                                        >
                                          <ul>
                                            <template
                                              v-for="(item5,
                                              i) in item.faqRecommendQuestions"
                                            >
                                              <li
                                                v-if="i <= 4"
                                                :key="item5.question"
                                                @click="
                                                  recommendClick(item5.question)
                                                "
                                              >
                                                <template
                                                  v-if="
                                                    !validatenull(
                                                      item5.dimensionName
                                                    )
                                                  "
                                                  >[{{
                                                    item5.dimensionName
                                                  }}]</template
                                                >
                                                {{ item5.question }}
                                              </li>
                                            </template>
                                          </ul>
                                          <p
                                            class="moreBtn"
                                            @click="topicMore('fap', item)"
                                          >
                                            {{ $t("aicosCommon.more") }}
                                          </p>
                                        </div>
                                        <ul
                                          v-if="item.faqShow"
                                          class="topicQuestionModule"
                                        >
                                          <li
                                            v-for="item5 in item.faqRecommendQuestions"
                                            :key="item5.question"
                                            @click="
                                              recommendClick(item5.question)
                                            "
                                          >
                                            <span style="font-size: 30px"
                                              >·</span
                                            >
                                            <template
                                              v-if="
                                                !validatenull(
                                                  item5.dimensionName
                                                )
                                              "
                                              >[{{
                                                item5.dimensionName
                                              }}]</template
                                            >
                                            {{ item5.question }}
                                          </li>
                                        </ul>
                                      </template>
                                      <template v-else>
                                        <ul class="topicQuestionModule">
                                          <li
                                            v-for="item5 in item.faqRecommendQuestions"
                                            :key="item5.question"
                                            @click="
                                              recommendClick(item5.question)
                                            "
                                          >
                                            <span style="font-size: 30px"
                                              >·</span
                                            >
                                            <template
                                              v-if="
                                                !validatenull(
                                                  item5.dimensionName
                                                )
                                              "
                                              >[{{
                                                item5.dimensionName
                                              }}]</template
                                            >
                                            {{ item5.question }}
                                          </li>
                                        </ul>
                                      </template>
                                    </el-tab-pane>
                                    <el-tab-pane
                                      :label="$t('kwRobotAnswer.table')"
                                      v-if="
                                        !validatenull(
                                          item.tableRecommendQuestions
                                        )
                                      "
                                    >
                                      <template
                                        v-if="
                                          item.tableRecommendQuestions.length >
                                            5
                                        "
                                      >
                                        <div
                                          class="topicQuestionModule"
                                          v-if="!item.tableShow"
                                        >
                                          <ul>
                                            <template
                                              v-for="(item5,
                                              i) in item.tableRecommendQuestions"
                                            >
                                              <li
                                                v-if="i <= 4"
                                                :key="item5.question"
                                                @click="
                                                  recommendClick(item5.question)
                                                "
                                              >
                                                <span style="font-size: 30px"
                                                  >·</span
                                                >
                                                <template
                                                  v-if="
                                                    !validatenull(
                                                      item5.dimensionName
                                                    )
                                                  "
                                                  >[{{
                                                    item5.dimensionName
                                                  }}]</template
                                                >
                                                {{ item5.question }}
                                              </li>
                                            </template>
                                          </ul>
                                          <div
                                            class="moreBtn"
                                            style="text-align: center"
                                            @click="topicMore('table', item)"
                                          >
                                            {{ $t("aicosCommon.more") }}
                                          </div>
                                        </div>
                                        <ul
                                          v-if="item.tableShow"
                                          class="topicQuestionModule"
                                        >
                                          <li
                                            v-for="item5 in item.tableRecommendQuestions"
                                            :key="item5.question"
                                            @click="
                                              recommendClick(item5.question)
                                            "
                                          >
                                            <span style="font-size: 30px"
                                              >·</span
                                            >
                                            <template
                                              v-if="
                                                !validatenull(
                                                  item5.dimensionName
                                                )
                                              "
                                              >[{{
                                                item5.dimensionName
                                              }}]</template
                                            >
                                            {{ item5.question }}
                                          </li>
                                        </ul>
                                      </template>
                                      <template v-else>
                                        <ul class="topicQuestionModule">
                                          <li
                                            v-for="item5 in item.tableRecommendQuestions"
                                            :key="item5.question"
                                            @click="
                                              recommendClick(item5.question)
                                            "
                                          >
                                            <span style="font-size: 30px"
                                              >·</span
                                            >
                                            <template
                                              v-if="
                                                !validatenull(
                                                  item5.dimensionName
                                                )
                                              "
                                              >[{{
                                                item5.dimensionName
                                              }}]</template
                                            >
                                            {{ item5.question }}
                                          </li>
                                        </ul>
                                      </template>
                                    </el-tab-pane>
                                  </el-tabs>
                                </template>
                                <template v-else>
                                  <div v-if="item.selectorName !== 'flow'">
                                    <div class="asking">
                                      <span
                                        style="color: #999; font-size: 14px"
                                        >{{
                                          $t("kwRobotAnswer.guessWant")
                                        }}</span
                                      >
                                      <el-button
                                        class="moreBtn el-icon-arrow-down"
                                        type="text"
                                        v-if="
                                          !item.show &&
                                            item.response.recommendQuestions
                                              .length > 5
                                        "
                                        @click="moreClick(item)"
                                      >
                                        {{ $t("kwRobotAnswer.expand") }}
                                      </el-button>
                                      <el-button
                                        class="moreBtn el-icon-arrow-up"
                                        type="text"
                                        v-if="
                                          item.show &&
                                            item.response.recommendQuestions
                                              .length > 5
                                        "
                                        @click="packUpClick(item)"
                                      >
                                        {{ $t("kwRobotAnswer.retract") }}
                                      </el-button>
                                    </div>
                                    <template
                                      v-if="
                                        item.response.recommendQuestions
                                          .length > 5
                                      "
                                    >
                                      <div
                                        class="questionModule"
                                        v-if="!item.show"
                                      >
                                        <ul>
                                          <template
                                            v-for="(item5, i) in item.response
                                              .recommendQuestions"
                                          >
                                            <li
                                              v-if="i <= 4"
                                              :key="item5.question"
                                              @click="
                                                recommendClick(item5.question)
                                              "
                                            >
                                              <span style="font-size: 30px"
                                                >·</span
                                              >{{ item5.question }}
                                            </li>
                                          </template>
                                        </ul>
                                      </div>
                                      <ul
                                        v-if="item.show"
                                        class="questionModule"
                                      >
                                        <li
                                          v-for="item5 in item.response
                                            .recommendQuestions"
                                          :key="item5.question"
                                          @click="
                                            recommendClick(item5.question)
                                          "
                                        >
                                          <span style="font-size: 30px">·</span
                                          >{{ item5.question }}
                                        </li>
                                      </ul>
                                    </template>
                                    <template v-else>
                                      <ul class="questionModule">
                                        <li
                                          v-for="item5 in item.response
                                            .recommendQuestions"
                                          :key="item5.question"
                                          @click="
                                            recommendClick(item5.question)
                                          "
                                        >
                                          <span style="font-size: 30px">·</span
                                          >{{ item5.question }}
                                        </li>
                                      </ul>
                                    </template>
                                  </div>
                                </template>
                              </template>
                            </template>
                          </div>
                          <div
                            class="aicc-welcome-text"
                            rel="aiccText"
                            v-else
                            v-html="item.response.str"
                          ></div>
                        </template>
                        <template v-else>
                          <div
                            class="aicc-welcome-text"
                            rel="aiccText"
                            v-if="!item.response.unknownShow"
                          >
                            <!-- AiSearch -->
                              <!-- <template
                                v-if="item.response.responses[1]
                                    .multiModalTracks[0].text.length == 0
                                "
                              > -->
                              <template
                                v-if="
                                  typeof item.response.responses[1]
                                    .multiModalTracks[0].text == 'string'
                                "
                              >
                                {{
                                  item.response.responses[1].multiModalTracks[0]
                                    .text
                                }}
                              </template>
                              <template v-else>
                                <template
                                  v-if="
                                    item.response.responses[1]
                                      .multiModalTracks[0].text.length > 1
                                  "
                                >
                                  <div
                                    class="articlTitle"
                                    v-for="ele in item.response.responses[1]
                                      .multiModalTracks[0].text"
                                    :key="ele.id"
                                  >
                                    <a :href="ele.url" target="_blank">{{
                                      ele.title
                                    }}</a>
                                  </div>
                                </template>
                                <template v-else>
                                  <div>
                                    <span>{{
                                      item.response.responses[1]
                                        .multiModalTracks[0].text[0].value
                                    }}</span>
                                    <span class="onlyAbstract"
                                      ><a
                                        :href="
                                          item.response.responses[1]
                                            .multiModalTracks[0].text[0].url
                                        "
                                        target="_blank"
                                        >{{$t("kwRobotAnswer.articleDetails")}}>></a
                                      ></span
                                    >
                                  </div>
                                </template>
                              </template>
                          </div>
                          <div
                            class="aicc-welcome-text"
                            rel="aiccText"
                            v-else
                            v-html="item.response.str"
                          ></div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="charting-setting" style="text-align: left">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="$t('kwRobotAnswer.shakedownTest')"
                    placement="bottom"
                  >
                    <el-button
                      icon="el-icon-setting"
                      size="mini"
                      @click="debugClick(item.response)"
                    ></el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <HuilanDialog
      ref="dialog"
      :title="$t('kwRobotAnswer.createKnowledge')"
      :visible.sync="createDialogVisible"
      append-to-body
      width="600px"
    >
      <Createknowledge ref="createknowledge" v-if="createDialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="createDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerCreate"
          :disabled="disable"
          >{{ $t("kwRobotAnswer.goToCreate") }}</el-button
        >
      </template>
    </HuilanDialog>
    <HuilanDialog
      ref="dialog"
      :title="$t('kwRobotAnswer.knowledgeAnnotation')"
      :visible.sync="dialogVisible"
      append-to-body
      width="55%"
    >
      <Knowledgelabel
        ref="knowledgelabel"
        :rowData="marketData"
        v-if="dialogVisible"
        @refresh="refresh"
      />
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSave"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <el-drawer
      :title="$t('kwRobotAnswer.addKnowledge')"
      :visible.sync="manageDialogVisible"
      append-to-body
      show-close
      @close="manageDialogVisible = false"
      size="60%"
    >
      <template v-if="selectType === 'faq' && manageDialogVisible">
        <AddFaq
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'chat' && manageDialogVisible">
        <AddChat
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'table' && manageDialogVisible">
        <AddTable
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'intention' && manageDialogVisible">
        <Addintention
          @back="addOrEditEmitEvent"
          :botId="botId"
          :rowData="selectRow"
          classifyId="0"
          addType="parent"
        />
      </template>
    </el-drawer>
    <!-- 匹配结果编辑 -->
    <el-drawer
      :title="$t('kwRobotAnswer.intentionalEditing')"
      :visible.sync="abnormalDialogVisible"
      append-to-body
      show-close
      @close="closeEditIntent"
      size="75%"
    >
      <Addintent
        style="padding: 20px"
        @back="closeEditIntent"
        :isEdit="true"
        :botId="botObj.id"
        :cur="selectRow"
      />
    </el-drawer>
  </div>
</template>
<script>
import Addintent from "@/views/kwKnowledgeCenter/kwIntentionManage/add";
import Createknowledge from "../knowledgeOptimize/kwRobotStudy/createknowledge";
import Knowledgelabel from "../knowledgeOptimize/kwRobotStudy/knowledgeLabel/index";
import AddFaq from "../knowledgeOptimize/kwRobotStudy/createknowledge/addfaq/addFaq";
import AddChat from "../knowledgeOptimize/kwRobotStudy/createknowledge/addchat/addChat";
import AddTable from "../knowledgeOptimize/kwRobotStudy/createknowledge/addtable/addTable";
import Addintention from "../knowledgeOptimize/kwRobotStudy/createknowledge/addintention";
import socket from "./common";
import { mapGetters } from "vuex";
export default {
  components: {
    Createknowledge,
    Knowledgelabel,
    AddFaq,
    AddChat,
    AddTable,
    Addintention,
    Addintent
  },
  props: {
    message: {
      type: Array,
      default: () => []
    },
    selectRobotName: {
      type: String,
      default: ""
    },
    selectRobotId: {
      type: String,
      default: ""
    },
    form: {
      type: Object,
      default: () => {}
    },
    customerAngles: {
      type: String,
      default: ""
    },
    knowledgeAngle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      abnormalDialogVisible: false,
      activeNames: [],
      activeName: [],
      kefuImg: require("@/assets/kwRobotAnswer/robotAvater.png"),
      kehuImg: require("@/assets/kwRobotAnswer/visitorAvater.png"),
      botId: this.$store.getters.botObj.id,
      selectRow: {},
      // 创建知识
      createDialogVisible: false,
      // 知识标注
      dialogVisible: false,
      // 知识创建
      manageDialogVisible: false,
      selectType: "",
      marketData: []
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["userInfo", "botObj"])
  },
  mounted() {
    console.log("message", this.message);
  },

  methods: {
    editClick(id) {
      this.selectRow.id = id;
      this.abnormalDialogVisible = true;
    },
    closeEditIntent() {
      this.abnormalDialogVisible = false;
    },
    // 调试
    debugClick(data) {
      this.$emit("debug", data);
    },
    //
    followClick(val) {
      this.socketEvent(val);
    },
    // 推荐问
    recommendClick(val) {
      this.socketEvent(val);
    },
    // socket连接
    socketEvent(message) {
      socket.sendSocketEvent(
        { message },
        {
          tenantId: this.$store.state.user.currentTenantId,
          userId: this.userInfo.id,
          robotId: this.selectRobotId,
          angleParam: {
            channelAngle: this.form.channelAngle,
            flag: this.form.flag,
            customerAngles: this.customerAngles,
            knowledgeAngle: this.knowledgeAngle
          },
          debug: true
        }
      );
    },
    topicMore(type, val) {
      this.message.forEach(item => {
        if (item.id === val.id) {
          if (type === "faq") {
            item.faqShow = true;
          }
          if (type === "table") {
            item.tableShow = true;
          }
        }
      });
    },
    // 更多
    moreClick(val) {
      this.message.forEach(item => {
        if (item.id === val.id) {
          item.show = true;
        }
      });
    },
    // 收起
    packUpClick(val) {
      this.message.forEach(item => {
        if (item.id === val.id) {
          item.show = false;
        }
      });
    },
    // 创建知识
    createFun(row) {
      this.createDialogVisible = true;
      this.selectRow = row;
      this.selectRow.question = row.message;
    },
    // 知识标注
    knowledgeMarker(row) {
      this.marketData = [];
      this.dialogVisible = true;
      row.question = row.message;
      this.marketData.push(row);
    },
    handlerCreate() {
      const { createknowledge } = this.$refs;
      if (createknowledge.value === "") {
        this.$message.warning(this.$t("kwRobotAnswer.selectClassification"));
        return;
      }
      this.selectType = createknowledge.value;
      this.createDialogVisible = false;
      this.manageDialogVisible = true;
    },
    addOrEditEmitEvent() {
      this.manageDialogVisible = false;
      this.$forceUpdate();
    },
    handlerSave() {
      this.$refs.knowledgelabel.handleSave();
    },
    async refresh() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.aicc-table-item .aicc-table-content table,
.aicc-table-item .aicc-table-content table td,
.aicc-table-item .aicc-table-content table th {
  text-align: center;
  border: 1px solid #000;
  border-collapse: collapse;
}

.aicc-table-item .aicc-table-content table td {
  padding: 10px 30px;
}
.onlyAbstract {
  a {
    text-decoration: underline;
    cursor: pointer;
  }
}
.articlTitle {
  a {
    text-decoration: underline;
    cursor: pointer;
    color: #000;
  }
}
</style>
