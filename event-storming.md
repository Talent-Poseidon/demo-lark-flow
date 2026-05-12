@startuml
header Sistem Assessment - Event Storming (2 Epic / Testing)
title Diagram Alur — Master Data & Project Management

skinparam monochrome false
skinparam packageStyle rectangle
skinparam shadowing false

legend left
    |= Warna |= Tipe Komponen |
    |<#FEF5E7>| Aggregate (Kuning) |
    |<#FAD7A0>| Domain Event (Oranye) |
    |<#AED6F1>| Command (Biru Muda) |
    |<#ABEBC6>| System (Hijau) |
    |<#F5B7B1>| Policy (Pink) |
    |<#D7BDE2>| View (Ungu) |
endlegend

node "Master Data Setup" {
    [Setup Kamus] <<Aggregate>>
    [Submit Kamus by template] <<Command>>
    [Kamus Submitted] <<Domain Event>>
    [Kamus Potensi & Kompetensi] <<View>>

    [Setup Standar Jabatan] <<Aggregate>>
    [Submit Standar] <<Command>>
    [Standar Submitted] <<Domain Event>>

    [Setup Scenario] <<Aggregate>>
    [Submit Scenario] <<Command>>
    [Scenario Submitted] <<Domain Event>>
}

node "Project Management" {
    [Setup Project] <<Aggregate>>
    [Create Project] <<Command>>
    [Submit Project] <<Domain Event>>
    [1 Batch Max 20] <<Policy>>

    [Send Invitation] <<System>>
    [Assessee Notified] <<Domain Event>>
    [Invitation Expired 7 Day] <<Policy>>

    [Assign Assessor] <<Command>>
    [Assessor Assigned] <<Domain Event>>
}

' Relationships — Master Data Setup
[Submit Kamus by template] --> [Kamus Submitted]
[Kamus Submitted] --> [Setup Standar Jabatan]
[Kamus Submitted] --> [Setup Scenario]

' Relationships — Project Management
[Submit Project] --> [Send Invitation]
[Submit Project] --> [Assign Assessor]
[Send Invitation] --> [Assessee Notified]

@enduml
