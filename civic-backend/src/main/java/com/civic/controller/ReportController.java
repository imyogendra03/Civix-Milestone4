package com.civic.controller;

import com.civic.dto.MonthlyReportResponse;
import com.civic.entity.*;
import com.civic.repository.*;
import lombok.RequiredArgsConstructor;

import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.Document;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.security.core.context.SecurityContextHolder;


@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final PetitionRepository petitions;
    private final PollRepository polls;
    private final SignatureRepository signatures;
    private final VoteRepository votes;
    private final UserRepository users;


    // ============================================================
    // MONTHLY REPORT
    // ============================================================

    @GetMapping("/monthly")
    public MonthlyReportResponse monthly(
            @RequestParam int year,
            @RequestParam int month) {

        LocalDateTime start =
                LocalDateTime.of(year, month, 1, 0, 0);

        LocalDateTime end =
                start.plusMonths(1);

        List<Petition> petitionList =
                scopePetitions();

        List<Poll> pollList =
                scopePolls();

        long totalPetitions =
                petitionList.stream()
                        .filter(p ->
                                between(
                                        p.getCreatedAt(),
                                        start,
                                        end
                                )
                        )
                        .count();

        long totalSignatures =
                signatures.findAll()
                        .stream()
                        .filter(s ->
                                between(
                                        s.getSignedAt(),
                                        start,
                                        end
                                )
                        )
                        .count();

        long totalPolls =
                pollList.stream()
                        .filter(p ->
                                between(
                                        p.getCreatedAt(),
                                        start,
                                        end
                                )
                        )
                        .count();

        long totalVotes =
                votes.findAll()
                        .stream()
                        .filter(v ->
                                between(
                                        v.getVotedAt(),
                                        start,
                                        end
                                )
                        )
                        .count();

        long activePetitions =
                petitionList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PetitionStatus.ACTIVE
                        )
                        .count();

        long underReviewPetitions =
                petitionList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PetitionStatus.UNDER_REVIEW
                        )
                        .count();

        long approvedPetitions =
                petitionList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PetitionStatus.APPROVED
                        )
                        .count();

        long rejectedPetitions =
                petitionList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PetitionStatus.REJECTED
                        )
                        .count();

        long closedPetitions =
                petitionList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PetitionStatus.CLOSED
                        )
                        .count();

        long activePolls =
                pollList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PollStatus.ACTIVE
                        )
                        .count();

        long closedPolls =
                pollList.stream()
                        .filter(p ->
                                p.getStatus() ==
                                com.civic.enums.PollStatus.CLOSED
                        )
                        .count();

        long activeEngagement =
                activePetitions + activePolls;


        return MonthlyReportResponse.builder()
                .year(year)
                .month(month)
                .monthName(
                        Month.of(month)
                                .getDisplayName(
                                        TextStyle.FULL,
                                        Locale.ENGLISH
                                )
                )
                .totalPetitions(totalPetitions)
                .totalSignatures(totalSignatures)
                .totalPolls(totalPolls)
                .totalVotes(totalVotes)
                .activePetitions(activePetitions)
                .underReviewPetitions(underReviewPetitions)
                .approvedPetitions(approvedPetitions)
                .rejectedPetitions(rejectedPetitions)
                .closedPetitions(closedPetitions)
                .activePolls(activePolls)
                .closedPolls(closedPolls)
                .activeEngagement(activeEngagement)
                .build();
    }


    // ============================================================
    // PDF EXPORT
    // ============================================================

    @GetMapping("/monthly/export/pdf")
    public ResponseEntity<byte[]> pdf(
            @RequestParam int year,
            @RequestParam int month) throws Exception {

        MonthlyReportResponse report =
                monthly(year, month);

        ByteArrayOutputStream output =
                new ByteArrayOutputStream();

        Document document =
                new Document();

        PdfWriter.getInstance(
                document,
                output
        );

        document.open();


        document.add(
                new Paragraph(
                        "CIVIX Monthly Civic Engagement Report",
                        FontFactory.getFont(
                                FontFactory.HELVETICA_BOLD,
                                18
                        )
                )
        );

        document.add(
                new Paragraph(
                        report.getMonthName()
                                + " "
                                + year
                )
        );

        document.add(
                new Paragraph(
                        "Total Petitions: "
                                + report.getTotalPetitions()
                                + " | Total Signatures: "
                                + report.getTotalSignatures()
                )
        );

        document.add(
                new Paragraph(
                        "Total Polls: "
                                + report.getTotalPolls()
                                + " | Total Votes: "
                                + report.getTotalVotes()
                )
        );

        document.add(
                new Paragraph(
                        "Active Engagement: "
                                + report.getActiveEngagement()
                )
        );

        document.add(
                new Paragraph(
                        "Petition Status - Active: "
                                + report.getActivePetitions()
                                + ", Under Review: "
                                + report.getUnderReviewPetitions()
                                + ", Approved: "
                                + report.getApprovedPetitions()
                                + ", Rejected: "
                                + report.getRejectedPetitions()
                                + ", Closed: "
                                + report.getClosedPetitions()
                )
        );

        document.add(
                new Paragraph(
                        "Poll Status - Active: "
                                + report.getActivePolls()
                                + ", Closed: "
                                + report.getClosedPolls()
                )
        );


        // --------------------------------------------------------
        // PETITION DETAILS
        // --------------------------------------------------------

        document.add(
                new Paragraph("Petition Details")
        );

        PdfPTable petitionTable =
                new PdfPTable(6);

        String[] petitionHeaders = {
                "Title",
                "Department",
                "Status",
                "Progress",
                "Signatures",
                "Expected Completion"
        };

        for (String header : petitionHeaders) {
            petitionTable.addCell(header);
        }


        for (Petition petition : scopePetitions()) {

            petitionTable.addCell(
                    safeString(petition.getTitle())
            );

            petitionTable.addCell(
                    petition.getDepartment() == null
                            ? ""
                            : petition.getDepartment()
            );

            petitionTable.addCell(
                    petition.getStatus() == null
                            ? ""
                            : petition.getStatus().name()
            );

            petitionTable.addCell(
                    String.valueOf(
                            petition.getProgressPercent() == null
                                    ? 0
                                    : petition.getProgressPercent()
                    )
                            + "%"
            );

            petitionTable.addCell(
                    String.valueOf(
                            petition.getCurrentSignatures()
                    )
            );

            petitionTable.addCell(
                    petition.getExpectedCompletionAt() == null
                            ? ""
                            : petition
                                    .getExpectedCompletionAt()
                                    .toString()
            );
        }

        document.add(petitionTable);


        // --------------------------------------------------------
        // POLL DETAILS
        // --------------------------------------------------------

        document.add(
                new Paragraph("Poll Details")
        );

        PdfPTable pollTable =
                new PdfPTable(5);

        String[] pollHeaders = {
                "Title",
                "Department",
                "Status",
                "Votes",
                "Close Date"
        };

        for (String header : pollHeaders) {
            pollTable.addCell(header);
        }


        for (Poll poll : scopePolls()) {

            pollTable.addCell(
                    safeString(poll.getTitle())
            );

            pollTable.addCell(
                    poll.getDepartment() == null
                            ? ""
                            : poll.getDepartment()
            );

            pollTable.addCell(
                    poll.getStatus() == null
                            ? ""
                            : poll.getStatus().name()
            );

            pollTable.addCell(
                    String.valueOf(
                            votes.countByPoll(poll)
                    )
            );

            pollTable.addCell(
                    poll.getCloseDate() == null
                            ? ""
                            : poll.getCloseDate().toString()
            );
        }

        document.add(pollTable);

        document.close();


        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=civix-report-"
                                + year
                                + "-"
                                + month
                                + ".pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(output.toByteArray());
    }


    // ============================================================
    // EXCEL EXPORT
    // ============================================================

    @GetMapping("/monthly/export/excel")
    public ResponseEntity<byte[]> excel(
            @RequestParam int year,
            @RequestParam int month) throws Exception {

        MonthlyReportResponse report =
                monthly(year, month);

        XSSFWorkbook workbook =
                new XSSFWorkbook();


        // --------------------------------------------------------
        // SUMMARY SHEET
        // --------------------------------------------------------

        XSSFSheet summary =
                workbook.createSheet("Summary");

        String[][] rows = {
                {"Metric", "Value"},
                {
                        "Total Petitions",
                        String.valueOf(
                                report.getTotalPetitions()
                        )
                },
                {
                        "Total Signatures",
                        String.valueOf(
                                report.getTotalSignatures()
                        )
                },
                {
                        "Total Polls",
                        String.valueOf(
                                report.getTotalPolls()
                        )
                },
                {
                        "Total Votes",
                        String.valueOf(
                                report.getTotalVotes()
                        )
                },
                {
                        "Active Engagement",
                        String.valueOf(
                                report.getActiveEngagement()
                        )
                },
                {
                        "Active Petitions",
                        String.valueOf(
                                report.getActivePetitions()
                        )
                },
                {
                        "Under Review Petitions",
                        String.valueOf(
                                report.getUnderReviewPetitions()
                        )
                },
                {
                        "Approved Petitions",
                        String.valueOf(
                                report.getApprovedPetitions()
                        )
                },
                {
                        "Rejected Petitions",
                        String.valueOf(
                                report.getRejectedPetitions()
                        )
                },
                {
                        "Closed Petitions",
                        String.valueOf(
                                report.getClosedPetitions()
                        )
                },
                {
                        "Active Polls",
                        String.valueOf(
                                report.getActivePolls()
                        )
                },
                {
                        "Closed Polls",
                        String.valueOf(
                                report.getClosedPolls()
                        )
                }
        };


        for (int i = 0; i < rows.length; i++) {

            var row =
                    summary.createRow(i);

            row.createCell(0)
                    .setCellValue(rows[i][0]);

            row.createCell(1)
                    .setCellValue(rows[i][1]);
        }


        // --------------------------------------------------------
        // PETITIONS SHEET
        // --------------------------------------------------------

        XSSFSheet petitionSheet =
                workbook.createSheet("Petitions");

        String[] petitionHeaders = {
                "Title",
                "Department",
                "Status",
                "Progress",
                "Signatures",
                "Responsible Official",
                "Expected Completion",
                "Pending Work"
        };


        for (int i = 0;
             i < petitionHeaders.length;
             i++) {

            petitionSheet
                    .createRow(0)
                    .createCell(i)
                    .setCellValue(
                            petitionHeaders[i]
                    );
        }


        int petitionRow = 1;


        for (Petition petition :
                scopePetitions()) {

            var row =
                    petitionSheet
                            .createRow(
                                    petitionRow++
                            );

            row.createCell(0)
                    .setCellValue(
                            safeString(
                                    petition.getTitle()
                            )
                    );

            row.createCell(1)
                    .setCellValue(
                            petition.getDepartment() == null
                                    ? ""
                                    : petition.getDepartment()
                    );

            row.createCell(2)
                    .setCellValue(
                            petition.getStatus() == null
                                    ? ""
                                    : petition
                                            .getStatus()
                                            .name()
                    );

            row.createCell(3)
                    .setCellValue(
                            (
                                    petition
                                            .getProgressPercent()
                                            == null
                                            ? 0
                                            : petition
                                                    .getProgressPercent()
                            )
                                    + "%"
                    );

            row.createCell(4)
                    .setCellValue(
                            petition
                                    .getCurrentSignatures()
                    );

            row.createCell(5)
                    .setCellValue(
                            petition
                                    .getResponsiblePerson()
                                    == null
                                    ? ""
                                    : petition
                                            .getResponsiblePerson()
                    );

            row.createCell(6)
                    .setCellValue(
                            petition
                                    .getExpectedCompletionAt()
                                    == null
                                    ? ""
                                    : petition
                                            .getExpectedCompletionAt()
                                            .toString()
                    );

            row.createCell(7)
                    .setCellValue(
                            petition
                                    .getPendingWork()
                                    == null
                                    ? ""
                                    : petition
                                            .getPendingWork()
                    );
        }


        // --------------------------------------------------------
        // POLLS SHEET
        // --------------------------------------------------------

        XSSFSheet pollSheet =
                workbook.createSheet("Polls");

        String[] pollHeaders = {
                "Title",
                "Department",
                "Status",
                "Votes",
                "Close Date"
        };


        for (int i = 0;
             i < pollHeaders.length;
             i++) {

            pollSheet
                    .createRow(0)
                    .createCell(i)
                    .setCellValue(
                            pollHeaders[i]
                    );
        }


        int pollRow = 1;


        for (Poll poll :
                scopePolls()) {

            var row =
                    pollSheet.createRow(
                            pollRow++
                    );

            row.createCell(0)
                    .setCellValue(
                            safeString(
                                    poll.getTitle()
                            )
                    );

            row.createCell(1)
                    .setCellValue(
                            poll.getDepartment() == null
                                    ? ""
                                    : poll.getDepartment()
                    );

            row.createCell(2)
                    .setCellValue(
                            poll.getStatus() == null
                                    ? ""
                                    : poll.getStatus().name()
                    );

            row.createCell(3)
                    .setCellValue(
                            votes.countByPoll(poll)
                    );

            row.createCell(4)
                    .setCellValue(
                            poll.getCloseDate() == null
                                    ? ""
                                    : poll.getCloseDate().toString()
                    );
        }


        // --------------------------------------------------------
        // OUTPUT
        // --------------------------------------------------------

        ByteArrayOutputStream output =
                new ByteArrayOutputStream();

        workbook.write(output);

        workbook.close();


        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=civix-report-"
                                + year
                                + "-"
                                + month
                                + ".xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(
                        output.toByteArray()
                );
    }


    // ============================================================
    // DATE HELPER
    // ============================================================

    private boolean between(
            LocalDateTime value,
            LocalDateTime start,
            LocalDateTime end) {

        return value != null
                && !value.isBefore(start)
                && value.isBefore(end);
    }


    // ============================================================
    // PETITION ACCESS SCOPE
    // ============================================================

    private List<Petition> scopePetitions() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User user =
                users.findByEmail(email)
                        .orElseThrow();


        if (user.getRole() == Role.OFFICIAL) {

            return petitions.findAll()
                    .stream()
                    .filter(
                            petition ->
                                    user.getDepartment() != null
                                    && petition.getDepartment() != null
                                    && user.getDepartment()
                                            .equalsIgnoreCase(
                                                    petition.getDepartment()
                                            )
                    )
                    .toList();
        }


        return petitions.findAll();
    }


    // ============================================================
    // POLL ACCESS SCOPE
    // ============================================================

    private List<Poll> scopePolls() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        User user =
                users.findByEmail(email)
                        .orElseThrow();


        if (user.getRole() == Role.OFFICIAL) {

            return polls.findAll()
                    .stream()
                    .filter(
                            poll ->
                                    user.getDepartment() != null
                                    && poll.getDepartment() != null
                                    && user.getDepartment()
                                            .equalsIgnoreCase(
                                                    poll.getDepartment()
                                            )
                    )
                    .toList();
        }


        return polls.findAll();
    }


    // ============================================================
    // STRING HELPER
    // ============================================================

    private String safeString(String value) {

        return value == null
                ? ""
                : value;
    }
}