"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import {
  Interface__KMISLearningAttempt,
  Interface__KMISQuizResponse,
} from "@/constants/interfaces";
import useLang from "@/context/useLang";
import {
  Box,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";

interface Props extends StackProps {
  quizResponses?: {
    learningParticipant: Interface__KMISLearningAttempt;
    exam: Interface__KMISQuizResponse[];
  };
}
const AnswerOption = (props: any) => {
  // Props
  const { optionLetter, optionKey, quizResponse, ...restProps } = props;

  // States
  const resolvedRes: Interface__KMISQuizResponse = quizResponse;
  const isOptionCorrect = optionLetter === resolvedRes?.quiz?.correctOption;
  const isOptionWrong =
    optionLetter !== resolvedRes?.quiz?.correctOption &&
    optionLetter === resolvedRes?.selectedOption;
  const isAnswer = resolvedRes?.selectedOption === optionLetter;

  console.debug(resolvedRes);

  return (
    <Btn
      clicky={false}
      justifyContent={"start"}
      variant={"outline"}
      borderColor={
        isOptionCorrect
          ? "border.success"
          : isOptionWrong
          ? "border.error"
          : "border.muted"
      }
      {...restProps}
    >
      <P>{optionLetter}</P>
      <P>{(resolvedRes as Record<string, any>)?.quiz?.[optionKey]}</P>

      {isAnswer && <DotIndicator ml={"auto"} />}
    </Btn>
  );
};
export const ReviewQuizWorkspace = (props: Props) => {
  // Props
  const { quizResponses, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const quizResponse = quizResponses?.exam?.[activeIdx];
  const options = [
    {
      optionLetter: "A",
      optionKey: "answerA",
    },
    {
      optionLetter: "B",
      optionKey: "answerB",
    },
    {
      optionLetter: "C",
      optionKey: "answerC",
    },
    {
      optionLetter: "D",
      optionKey: "answerD",
    },
  ];

  return (
    <Stack flexDir={["column", null, "row"]} gap={4} {...restProps}>
      <ItemContainer
        gap={2}
        p={4}
        border={"1px solid"}
        borderColor={"border.muted"}
      >
        <P fontWeight={"semibold"}>{`No. ${activeIdx + 1}`}</P>

        <P fontWeight={"medium"}>{quizResponse?.quiz?.question}</P>

        <CContainer gap={2} mt={2}>
          {options.map(({ optionLetter, optionKey }) => {
            return (
              <AnswerOption
                key={optionKey}
                optionLetter={optionLetter}
                optionKey={optionKey}
                quizResponse={quizResponse}
              />
            );
          })}
        </CContainer>

        <HStack align={"start"} color={"fg.muted"} mt={4} px={1}>
          <P>{l.explanation}</P>

          <P>:</P>

          <P>{quizResponse?.quiz?.explanation || "-"}</P>
        </HStack>

        <HStack mt={4} justify={"end"}>
          <Btn
            variant={"ghost"}
            disabled={activeIdx === 0}
            onClick={() => {
              setActiveIdx((ps) => ps - 1);
            }}
          >
            <Icon>
              <IconArrowLeft stroke={1.5} />
            </Icon>

            {l.previous}
          </Btn>

          <Btn
            variant={"ghost"}
            disabled={
              quizResponses && activeIdx === quizResponses?.exam?.length - 1
            }
            onClick={() => {
              setActiveIdx((ps) => ps + 1);
            }}
          >
            {l.next}

            <Icon>
              <IconArrowRight stroke={1.5} />
            </Icon>
          </Btn>
        </HStack>
      </ItemContainer>

      <ItemContainer
        w={["full", null, "fit"]}
        h={"fit"}
        gap={4}
        p={4}
        border={"1px solid"}
        borderColor={"border.muted"}
      >
        <P fontWeight={"semibold"}>{l.list_of_questions}</P>

        <SimpleGrid columns={5} gap={2} w={"max"}>
          {quizResponses?.exam?.map((res, idx) => {
            const isActive = activeIdx === idx;
            const isCorrect = res.isCorrect;
            const isAnswered = !!res.selectedOption;

            return (
              <Btn
                key={idx}
                iconButton
                size={"xs"}
                variant={isAnswered ? "subtle" : "outline"}
                colorPalette={isAnswered ? (isCorrect ? "green" : "red") : ""}
                border={isActive ? "1px solid" : "none"}
                borderColor={
                  isAnswered ? (isCorrect ? "green" : "red") : "border.muted"
                }
                onClick={() => setActiveIdx(idx)}
              >
                {idx + 1}
              </Btn>
            );
          })}
        </SimpleGrid>

        <CContainer gap={2} px={"2px"}>
          <HStack>
            <Box w={"12px"} aspectRatio={1} bg={"fg.success"} rounded={"xs"} />
            <P>{l.correct_answer}</P>
          </HStack>

          <HStack>
            <Box w={"12px"} aspectRatio={1} bg={"fg.error"} rounded={"xs"} />
            <P>{l.wrong_answer}</P>
          </HStack>
        </CContainer>
      </ItemContainer>
    </Stack>
  );
};
