// Import the cheerio library
import * as cheerio from 'cheerio' // Define a function to extract information from the provided HTML

function extractVehicleInfo(htmlContent: string) {
  // Load the HTML content using cheerio
  const $ = cheerio.load(htmlContent)

  // Extract the required information using cheerio's selectors
  const besiktigasSenast = $("p:contains('Besiktigas senast')")
    .contents()
    .filter(function () {
      return this.nodeType === 3 // Node type 3 is text node
    })
    .text()
    .trim()
  console.log(besiktigasSenast.match('20[1-9]{2}-[0-1][0-9]-[0-3][0-9]'))

  const fordonsslag = $("p:contains('Fordonsslag')")
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .text()
    .trim()

  const fordonetTillverkat = $("p:contains('Fordonet tillverkat')")
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .text()
    .trim()

  const handelsbeteckning = $("p:contains('Handelsbeteckning')")
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .text()
    .trim()

  const fabrikat = $("p:contains('Fabrikat')")
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .text()
    .trim()

  // Return the extracted information as an object
  return {
    besiktigasSenast,
    fordonsslag,
    fordonetTillverkat,
    handelsbeteckning,
    fabrikat,
  }
}

function extractVehicleInfo2(htmlContent: string) {
  // Load the HTML content using cheerio
  const $ = cheerio.load(htmlContent)

  // Function to extract the desired text value cleanly
  const extractValue = (selector: string) => {
    return $(selector)
      .contents()
      .filter(function () {
        return this.nodeType === 3 // Only keep text nodes
      })
      .text()
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '')[0]
      .trim() // Take the first non-empty line and trim it
  }

  // Extract the required information using the defined function
  const besiktigasSenast = extractValue("p:contains('Besiktigas senast')")
  const extractedBesiktigas = besiktigasSenast?.match('20[1-9]') //{2}-[0-1][0-9]-[0-3][0-9]')
  console.log('extracted', extractedBesiktigas)
  const fordonsslag = extractValue("p:contains('Fordonsslag')")
  const fordonetTillverkat = extractValue("p:contains('Fordonet tillverkat')")
  const handelsbeteckning = extractValue("p:contains('Handelsbeteckning')")
  const fabrikat = extractValue("p:contains('Fabrikat')")

  // Return the extracted information as an object
  return {
    besiktigasSenast,
    fordonsslag,
    fordonetTillverkat,
    handelsbeteckning,
    fabrikat,
  }
}

// Example usage with the provided HTML content
const htmlContent = `<style type="text/css"></style></head>
<body style="">
    <div id="page" class="container" data-timeout-url="/UppgifterAnnatFordon/Timeout" data-logout-url="/UppgifterAnnatFordon/LoggaUtSpecial">

        <header>
    <div id="header" class="row">
        <div id="transport-container" class="col-sm-9 col-xs-12">
            <!-- Vitt block (logga + trafikslagsknappar) -->
            <div class="row">
                <div id="logotype" class="col-sm-4 col-xs-12">
                    <a href="#" data-target="#modalForLeavingSite" data-toggle="modal" data-keyboard="true">
                        <img src="Fordonsuppgifter_files/logo_sv.png" alt="Transportstyrelsen" class="ts-header-logo">
                    </a>
                </div>
                <!-- /nav-transport -->
            </div>
            <!-- /transport-container -->
        </div>
    </div>
</header>


        <div id="mainHeader" class="row">
            <div id="logginmenucontent">
                
            </div>
        </div>
        <main id="main" class="row">
            <div id="content" class="col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-3">
                <div class="row">
                    <div id="content-primary" class="col-md-8 ts-full-height-container">
                        <div>
                            




<form action="/" method="post"><input name="__RequestVerificationToken" type="hidden" value="aySt_o-lJGC2R9HQOSWEV99F1rxNyWVp05CH5ufdjLC_Tjjslxhuz32x2QwFfpZ00rXErySALUaKihGzwIk5pWyadoi8NGXAcI1zlGaxIHc1">    <h1 class="ts-h1">Fordonsuppgifter för PJO032</h1>
    <div class="panel-group" id="accordion">

        <!--Ta bort detta sedan-->
        


        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-sammanfattning-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-sammanfattningCollapse" aria-expanded="true">
            <a href="#ts-sammanfattning-heading" data-parent="#accordion">
                Sammanfattning<span class="glyphicon ts-chevron pull-right glyphicon-chevron-up"></span>
            </a>
        </span>
    </div>
    <div id="ts-sammanfattningCollapse" class="panel-collapse collapse in" aria-expanded="true" style="">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        (2*)<strong>Registreringsnummer</strong>
                        <br>
                        PJO032

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFabrikatOchTyp" data-toggle="modal">
                                Fabrikat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        BMW

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samHandelsbeteckning" data-toggle="modal">
                                Handelsbeteckning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        320D XDRIVE

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-fordonsstatus" data-keyboard="true" data-toggle="modal">
                                Fordonsstatus <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Påställt (2017-06-20)

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Färg</strong>
                        <br>
                        Grå

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonsar" data-toggle="modal">
                                Fordonsår <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
2017
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonTillverkat" data-toggle="modal">
                                Fordonet tillverkat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2017-05

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Fordonsslag</strong>
                        <br>
                        Personbil

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                        <p>
                            (8*)<strong>Besiktigas senast</strong>
                            <br>
                            2025-05-31

                        </p>
                </div>
                                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-samanvandningsforbud" data-toggle="modal">
                                    Användningsförbud <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Nej
                    </p>
                </div>
                                <div class="col-sm-12 col-xs-12">
                    <p>
                        *numrering enligt harmoniserade unionskoder i 2014/45/EU bilaga II
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="fullstandiga-uppgifter">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-fullstandigaCollapse">
            <a href="#fullstandiga-uppgifter">Uppgifter som inte får visas i tjänsten <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span><span title="Vi får inte visa vissa uppgifter i tjänsten. För att ta del av uppgifterna kan du ange din mejladress." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span></a>
        </span>
    </div>
    <div id="ts-fullstandigaCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="alert alert-info ts-full-info" role="alert">
                <!-- Info om privat ägare -->
                <div class="media">
                    <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger hidden-xs hidden-sm"></span>
                    <div class="media-body">
                        <p>Fordonet ägs av en privatperson. Enligt 
dataskyddsförordningen (GDPR) får vi inte visa namn på ägare och 
tidigare ägare i tjänsten. </p>
                        <p><a href="https://fordon-fu-regnr.transportstyrelsen.se/UppgifterAnnatFordon/Registerutdrag/638596210681440932" target="_self">Du kan beställa ett mejl med fordons- och ägaruppgifter.</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default ts-panel">
    <div class="panel-heading" id="agare">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-agareCollapse">
            <a href="#agare">Ägare/brukare
                <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> <span title="Fordonet ägs av en privatperson." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
            </a>
        </span>
    </div>
    <div id="ts-agareCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="alert alert-info ts-agar-info" role="alert">
                <!-- Info om privat ägare -->
                <div class="media">
                    <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger hidden-xs hidden-sm"></span>
                    <div class="media-body">
                        <p>Fordonet ägs av en privatperson och därför visas inte namn på nuvarande eller tidigare ägare i tjänsten. <a href="https://fordon-fu-regnr.transportstyrelsen.se/UppgifterAnnatFordon/Registerutdrag/638596210681440932" target="_self">Du kan beställa ett mejl med fordons- och ägaruppgifter</a>. Du kan också få reda på vem som är ägare via <a target="_blank" title="Läs mer om vår sms-tjänst Vem äger fordonet" href="https://www.transportstyrelsen.se/sms-agare">sms-tjänsten Vem äger fordonet? <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Förvärvsdatum</strong><br>
                        2017-06-20

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-brukare" data-toggle="modal">
                                Antal brukare <span id="ts-info-sign" title="Du kan ta reda på senaste två ägarna."></span><span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong><br>
                        1

                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-producent" data-toggle="modal">
                                    Producentansvarig <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            5563135002
                        </p>
                    </div>
            </div>
        </div>
    </div>
</div>
        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-fordonsidentitet-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-fordonsidentitetCollapse">
            <a href="#ts-fordonsidentitet-heading">Fordonsidentitet<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> </a>
        </span>
    </div>
    <div id="ts-fordonsidentitetCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Registreringsnummer</strong>
                        <br>
PJO032                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFabrikatOchTyp" data-toggle="modal">
                                Fabrikat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        BMW

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samHandelsbeteckning" data-toggle="modal">
                                Handelsbeteckning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        320D XDRIVE

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Färg</strong>
                        <br>
                        Grå

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Fordonsslag</strong><br>
                        Personbil

                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Fordonsslagsklass</strong><br>
                            Personbil
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-fordonskategori" data-toggle="modal">
                                    Fordonskategori <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            M1
                        </p>
                    </div>

                                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonsar" data-toggle="modal">
                                Fordonsår <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2017

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonTillverkat" data-toggle="modal">
                                Fordonet tillverkat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2017-05

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-identifiering" data-toggle="modal">
                                Identifieringsnummer <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        WBA8T5108HG818324

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        
                        <strong>Typgodkännandenummer</strong><br>
                        E1*2007/46*0559*09

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Typgodkännandedatum</strong>
                        <br>
                        2017-01-24

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-typ" data-toggle="modal">
                                Typ <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                    3-V

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>Variant</strong>
                    <br>
                    8T51

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>Version</strong>
                    <br>
                    6A2500L0

                </p>
            </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Skyltformat, fram</strong><br>
                        Enradig
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Skyltformat, bak</strong><br>
                        Enradig
                    </p>
                </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>
                        <a class="ts-forklaring" href="#ts-senansteUtfRegbevis" data-keyboard="true" data-toggle="modal">
                            Senaste utfärdade registreringsbevis del 1 <span class=" ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                        </a>
                    </strong>
                    <br>
                    2017-06-20

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>
                        <a class="ts-forklaring" href="#ts-senansteUtfRegbevis" data-keyboard="true" data-toggle="modal">
                            Senaste utfärdade registreringsbevis del 2 <span class=" ts-warning-sign glyphicon glyphicon-exclamation-sign ">
                            </span>
                        </a>
                    </strong>
                    <br>
                    2017-06-20

                </p>
            </div>
        </div>
    </div>
</div>
</div>

        <div class="panel panel-default ts-panel">
    <div class="panel-heading" id="status">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-statusCollapse">
            <a href="#status">Status<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-statusCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-fordonsstatus" data-toggle="modal">
                                Fordonsstatus <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Påställt (2017-06-20)


                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Påställt första gången i Sverige</strong><br>
                        2017-06-20

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>

                            <a class="ts-forklaring" data-keyboard="true" href="#ts-import" data-toggle="modal">
                                Import/införsel <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Nej

                    </p>
                </div>
                                            </div>
        </div>
    </div>
</div>


        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-besiktning-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-besiktningCollapse">
            <a href="#ts-besiktning-heading">Besiktning<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-besiktningCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>Besiktigas senast</strong>
                            <br>
2025-05-31
                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Senast godkända besiktning</strong>
                            <br>
                            2024-03-25
                        </p>
                    </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-matarstallning" data-toggle="modal">
                                Mätarställning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        145552

                    </p>
                </div>


                </div>
        </div>
    </div>
</div>

        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-skatt-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-skattCollapse">
            <a href="#ts-skatt-heading">Skatt och avgifter<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-skattCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-fordonsSkattsPlikt" data-toggle="modal">
                                    Fordonsskattepliktigt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Ja
                    </p>
                </div>

                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-arsSkatt" data-toggle="modal">
                                    Årsskatt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                                
                            </strong>
                            <br>
                            1781 kronor
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Vägtrafikregisteravgift</strong>
                            <br>
                            62  kronor
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Betalningsmånad/er</strong>
                            <br>
                            Maj
                        </p>
                    </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-anvandningsforbud" data-toggle="modal">
                                    Användningsförbud <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Nej
                    </p>
                </div>
                                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-aterbetalningAvstallning" data-toggle="modal">
                                    Återbetalning vid avställning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            1335 kronor
                        </p>
                    </div>
                                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Trängselskattepliktigt</strong>
                        <br>
                        Ja
                    </p>
                </div>

            </div>
        </div>
    </div>
</div>
        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-teknik-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-tekniskCollapse">
            <a href="#ts-teknik-heading">Tekniska data<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-tekniskCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="panel-group" id="accordion2">
<div class="panel panel-default">
    <div class="panel-heading" id="ts-kaross-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-karossCollapse">
            <a href="#ts-kaross-heading">Kaross<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-karossCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-karosseri" data-toggle="modal">
                                Kaross <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        AA (Sedan)

                    </p>
                </div>
                                            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-MattVikt-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-MattViktCollapse">
            <a href="#ts-MattVikt-heading">Mått och vikt<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    
    <div id="ts-MattViktCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Längd</strong>
                        <br>
                        4824 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Bredd</strong>
                        <br>
                        1828 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Höjd</strong>
                        <br>
                        1508 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-tjanstevikt" data-toggle="modal">
                                Tjänstevikt (faktisk vikt) <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        1805 kg
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-maxLastvikt" data-toggle="modal">
                                Max lastvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        425 kg
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-totalvikt" data-toggle="modal">
                                Totalvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2230 kg
                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-ursprungligTotalvikt" data-toggle="modal">
                                    Ursprunglig totalvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            2230 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-skatteviktKg" data-toggle="modal">
                                    Skattevikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            1800 kg
                        </p>
                    </div>
                                


            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-hjul-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-HjulOchAxlarCollapse">
            <a href="#ts-hjul-heading">Axlar och hjul <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-HjulOchAxlarCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Drivande axlar fram</strong>
                            <br>
                            1
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Drivande axlar bak</strong>
                            <br>
                            1
                        </p>
                    </div>
                            </div>
<hr>
<h2 class="ts-h2">Axel - 1</h2>
<div class="row ts-row-align">
        <div class="col-sm-6 col-xs-12">
            <p>
                <strong>
                    <a class="ts-forklaring" href="#ts-axelavstand" data-toggle="modal">
                        Max axelavstånd axel 1-2 <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                    </a>
                </strong>
                <br>
                2920 mm
            </p>
        </div>

            <div class="col-sm-6 col-xs-12">
            <p>
                <strong>Spårvidd</strong>
                <br>
                1541 mm
            </p>
        </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Däckdimension</strong>
            <br>
225/55 R17 97V        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Fälgdimension</strong>
            <br>
8Jx17/ET34 mm
        </p>
    </div>
            </div>
<hr>
<h2 class="ts-h2">Axel - 2</h2>
<div class="row ts-row-align">

            <div class="col-sm-6 col-xs-12">
            <p>
                <strong>Spårvidd</strong>
                <br>
                1586 mm
            </p>
        </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Däckdimension</strong>
            <br>
225/55 R17 97V        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Fälgdimension</strong>
            <br>
8Jx17/ET34 mm
        </p>
    </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default ts-panel">
    <div class="panel-heading" id="koppling">
        <span id="ts-h4-sub" class="panel-title" data-toggle="collapse" data-target="#ts-koppling-innerCollapse">
            <a href="#koppling">Kopplingsanordning och bromsar<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> <span title="Använd släpvagnskalkylatorn för att se om fordonet får dra ett specifikt släp." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span></a>
        </span>
    </div>
    <div id="ts-koppling-innerCollapse" class="panel-collapse collapse">
        <div class="panel-body">
                <div class="alert alert-info" role="alert">
                    <!-- Info om släp -->
                    <div class="media" id="ts-slapvagnskalkylatorn-info">
                        <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">
                            <p>Använd <a target="_blank" href="http://www.transportstyrelsen.se/slapvagnskalkylator">släpvagnskalkylatorn <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a> för att ta reda på om du får dra en specifik släpvagn eller husvagn med fordonet.</p>
                        </div>
                    </div>
                </div>
            <div class="row">
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Största belastning koppling fordon</strong>
                            <br>
                            75 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxViktslapvagn" data-toggle="modal">
                                    Max släpvagnsvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            1600 kg
                        </p>
                    </div>
                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxslapobroms" data-toggle="modal">
                                    Max släpvikt, obromsad <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                                </a>
                            </strong>
                            <br>
                            750 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxSamBruttovikt" data-toggle="modal">
                                    Max sammanlagd bruttovikt (tågvikt) <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            3905 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-slapmaxvidb" data-toggle="modal">
                                    Släpets högsta tillåtna totalvikt vid körkortsbehörighet B <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign"></span>
                                </a>
                            </strong> <br>
                            1270 kg
                        </p>

                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-slapmaxvidutokadb" data-toggle="modal">
                                    Släpets högsta tillåtna totalvikt vid utökad körkortsbehörighet B <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                                </a>
                            </strong>
                            <br>
                            2020 kg
                        </p>

                    </div>
                                                
                                                                                                <!-- Om vi bara har en träff i kopplingslistan så skapar vi ingen extra panel, det gör vi bara om vi har fler än en -->

            </div>
        </div>
    </div>
</div>
<div class="panel panel-default">
    <div class="panel-heading" id="ts-PassagerareSakerhet-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-PassagerareSakerhetCollapse">
            <a href="#ts-PassagerareSakerhet-heading">Passagerare<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-PassagerareSakerhetCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Antal passagerare, max</strong><br>  
                        4

                    </p>
                </div>
                                                                        
                                                                        
    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Krockkudde, främre passagerarplats</strong>
                            <br>
                            JA
                        </p>
                    </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-miljo-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-miljoCollapse">
            <a href="#ts-miljo-heading">Motor och miljö <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-miljoCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Växellåda</strong>
                            <br>
                            AUTOMAT

                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-slagvolym" data-toggle="modal">
                                    Slagvolym <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
1995                                cm<sup>3</sup>
                        </p>
                    </div>
                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Euroklassning</strong>
                            <br>
                            6
                        </p>
                    </div>
                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Utsläppsklass</strong>
                            <br>
                            EURO 6
                        </p>
                    </div>
                                                                                                    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Drivmedel</strong>
            <br>
            Diesel
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Motoreffekt</strong>
            <br>
            140 kW
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>
                <a class="ts-forklaring" href="#ts-effektnorm" data-toggle="modal">
                    Effektnorm <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                </a>
            </strong>
            <br>
            EG
        </p>
    </div>
<div class="col-sm-6 col-xs-12">
    <p>
        <strong>Max hastighet</strong>
        <br>
        225 km/h
    </p>
</div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Ljudnivå stillastående</strong>
            <br>
            76 dB
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>
                <a class="ts-forklaring" href="#ts-varvtalStillastaende" data-toggle="modal">
                    Varvtal stillastående <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                </a>
            </strong>
            <br>
            3000 min<sup>-1</sup>
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Ljudnivå vid körning</strong>
            <br>
            71 dB
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Avgasdirektiv/reglemente</strong>
            <br>
            715/2007*2015/45W
        </p>
    </div>





    </div>



    <hr>
    <h2 class="ts-h2"><strong>Koldioxidutsläpp, CO<sub>2</sub></strong></h2>
        <h3 class="ts-h3">Testcykel NEDC</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Landsvägskörning</strong>
                        <br>
                        113 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Stadskörning</strong>
                        <br>
                        144 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad körning</strong>
                        <br>
                        124 g/km
                    </p>
                </div>
                    </div>
    <hr>
    <h2 class="ts-h2"><strong>Bränsleförbrukning</strong></h2>
        <h3 class="ts-h3">Testcykel NEDC</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Landsvägskörning</strong>
                        <br>
                        4,3 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Stadskörning</strong>
                        <br>
                        5,5 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad körning</strong>
                        <br>
                        4,7 l/100km
                    </p>
                </div>
                    </div>

    <hr>
    <h2 class="ts-h2"><strong>Avgasutsläpp</strong></h2>
        <h3 class="ts-h3">Provningsförfarande: typ 1 testcykel NEDC</h3>
            <div class="row ts-row-align">
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Kolmonoxid, CO</strong>
                            <br>
                            123,5 mg/km
                        </p>
                    </div>
                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Kväveoxider, NOx</strong>
                            <br>
                            31,1 mg/km
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Kolväten och kväveoxider, THC + NOx</strong>
                            <br>
                            34,2 mg/km
                        </p>
                    </div>
                
            </div>
            

        </div>
    </div>
</div>
            </div>
        </div>
    </div>
</div>
<div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="tillagg">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-tillaggCollapse">
            <a href="#tillagg">Tilläggsinformation <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span><span title="Tillägsinformation" class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span></a>
        </span>
    </div>
    <div id="ts-tillaggCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            

            <div class="alert alert-info ts-agar-info" role="alert">
                <!-- Info om tillagg -->
                <div class="media">
                    <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger hidden-xs hidden-sm"></span>
                    <div class="media-body">
                        <p> All information om fordon finns inte i så 
kallade fasta fält. Ibland läggs viktig information in som fritext eller
 med vissa färdigbestämda dispens- eller textkoder som fungerar som 
upplysning till bland annat fordonsägare, besiktningsföretag eller 
polis. <a target="_blank" title="Läs mer om sådana dispens- och textkoder" href="https://transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Koder-for-fordonsuppgifter/">Läs mer om sådana dispens- och textkoder. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="row ts-row-align">
                <div class="col-sm-12 col-xs-12">
                    <p class="help-block">
                        Den här informationen innehåller eventuella 
dispenser och fordonstekniska tillägg för fordonet. Uppgifterna 
redovisas obehandlade från vägtrafikregistret och innehåller koder som 
kan vara svårtolkade.<br>
                    </p>
                </div>
                <div class="col-sm-12 col-xs-12">

<p>                                <strong>Textkod</strong>
                                <br>
T31W  FORDONET HAR MILJÖINNOVATIONER MED KOD E24 10                                    <br>
MINSKNINGEN AV CO2 ÄR 01,00 G/KM FÖR DRIVMEDEL 1                                    <br>
MINSKNINGEN AV CO2 ÄR 00,00 G/KM FÖR DRIVMEDEL 2                                    <br>
</p>
                </div>
            </div>
        </div>
    </div>
</div>
    </div>
    <input type="submit" value="Ny sökning" class=" btn btn-default">
    <input type="button" value="Dölj alla uppgifter" title="Fäll in alla kategorier. Bra om du vill dölja all information på sidan." id="minimize_button" class="btn btn-default pull-right">
    <input type="button" value="Visa alla uppgifter" title="Fäll ut alla kategorier. Bra om du vill skriva ut all information på sidan." id="expand_button" class="btn btn-default pull-right">
<div class="modal fade" tabindex="-1" id="ts-fordonsstatus" role="dialog" aria-hidden="true" aria-labelledby="ts-fordonsstatus">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsstatus</h4>
            </div>
            <div class="modal-body">
                <p>Visar om fordonet är påställt, avställt eller avregistrerat.</p>
                <div class="alert alert-info" role="alert">
                    <div class="media">
                        <span class="glyphicon glyphicon-info-sign pull-left ts-info-sign bigger"></span>
                        <div class="media-body">
                            <h4>Av- och påställning under kvällar och helger</h4>
                            <p>
                                Varje vardag klockan 19.30 och några 
timmar framåt sker en så kallad kvällsbearbetning och alla av- och 
påställningar som anmäls under den tiden läggs i en kö för att föras in i
 registret nästa vardagkväll. En sådan anmälan gäller från och med det 
datum anmälan sker, men det syns inte direkt i våra e-tjänster. (Om en 
anmälan sker under fredagens bearbetning kommer den inte att registreras
 förrän på måndag kväll.)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
    </div>
    <!-- /.modal-content -->
</div>
<!-- /.modal-dialog -->
<div class="modal fade" tabindex="-1" id="ts-samFabrikat" role="dialog" aria-hidden="true" aria-labelledby="ts-samFabrikat">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fabrikat</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets märke. Denna uppgift kan ibland även 
innehålla information om typ eller handelsbeteckning – se förklaring vid
 respektive fält.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFabrikatOchTyp" role="dialog" aria-hidden="true" aria-labelledby="ts-samFabrikatOchTyp">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fabrikat</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets märke. Denna uppgift kan ibland även 
innehålla information om typ eller handelsbeteckning – se förklaring vid
 respektive fält.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samHandelsbeteckning" role="dialog" aria-hidden="true" aria-labelledby="ts-samHandelsbeteckning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Handelsbeteckning</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets modell eller benämning (”populärnamn”). Saknas uppgift om handelsbeteckning kan den istället finnas i fältet fabrikat.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonsar" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonsar">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsår</h4>
            </div>
            <div class="modal-body">
                Uppgiften fastställs av Transportstyrelsen utifrån följande ordningsföljd:
                <ol>
                    <li>Fordonets årsmodell. Om årsmodell saknas är det istället</li>
                    <li>fordonets tillverkningsår. Saknas även tillverkningsår är det</li>
                    <li>det år då fordonet ställdes på första gången.</li>
                </ol>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonTillverkat" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonTillverkat">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonet tillverkat</h4>
            </div>
            <div class="modal-body">
                <p>Uppgiften kommer från tillverkaren och den kan bestå 
av ett fullständigt datum eller endast år och månad. Om 
Transportstyrelsen inte har fått in uppgiften från tillverkaren visas 
”Uppgift saknas”.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samAgarBundDisp" role="dialog" aria-hidden="true" aria-labelledby="ts-samAgarBundDisp">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Ägarbunden dispens</h4>
            </div>
            <div class="modal-body">
                <p>Undantag från regler som fordonet har genom särskilt 
beslut, och som endast gäller för nuvarande ägare. Om fordonet övergår 
till ny ägare upphör dispensen och fordonet måste eventuellt genomgå en 
registreringsbesiktning.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonsRelSkulder" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonsRelSkulder">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsrelaterade skulder</h4>
            </div>
            <div class="modal-body">
                <p>Kronofogden kan ta ett fordon i anspråk om det finns 
obetald fordonsskatt, trängselskatt, felparkeringsavgift eller 
infrastrukturavgift.<br>
                    Om fordonet sålts av en myndighet enligt 6 a § lag 
(1982:129) om flyttning av fordon i vissa fall, eller exekutivt av 
Kronofogden kan det dock inte tas i anspråk av Kronofogden för skulder 
uppkomna före eller samma datum som anges för undantaget.<br> 
                    Då visas följande text:<br>
                    UNDANTAG I ANSPRÅK ÅÅÅÅ-MM-DD
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samanvandningsforbud" role="dialog" aria-hidden="true" aria-labelledby="ts-samanvandningsforbud">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Användningsförbud</h4>
            </div>
            <div class="modal-body">
                <p>Visar om fordonet har ett användningsförbud. 
Användningsförbud innebär att fordonet inte får användas på grund av 
obetalda skatter eller avgifter.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-brukare" role="dialog" aria-hidden="true" aria-labelledby="ts-brukare">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Antal brukare</h4>
            </div>
            <div class="modal-body">
                <p>Antal brukare som varit registrerade som ägare till 
fordonet sedan det ställdes på för första gången. Brukare är oftast 
likställt med ägare till fordonet, men om fordonet är ett leasingfordon 
är leasinggivaren ägare till fordonet och brukaren den som leasar 
fordonet.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for Producentansvarig -->
<div class="modal fade" id="ts-producent" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-producent">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Producentansvarig</h4>
            </div>
            <div class="modal-body">
                <p>Producentansvaret är ett ekonomiskt ansvar för 
skrotning och återvinning av uttjänta fordon. Det innebär att 
producenten ska ansvara för att ett fordon skrotas på ett regelmässigt 
korrekt sätt. <a target="_blank" title="Läs mer om producentansvar och skrotning." href="https://transportstyrelsen.se/avregistrering-och-skrotning/">Läs mer om producentansvar och skrotning. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for Fordonskategori -->
<div class="modal fade" id="ts-fordonskategori" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-fordonskategori">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonskategori</h4>
            </div>
            <div class="modal-body">
                <p>
                    En indelning av fordon utifrån fordonets ändamål och exempelvis vikt, antal sittplatser eller konstruktion.
                </p>
                <p>
                    <a target="_blank" title="Fordonskategorier" href="https://transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Koder-for-fordonsuppgifter/">Läs mer om fordonskategorier. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a>
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for Fordonskategori -->
<div class="modal fade" id="ts-bussklass" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-bussklass">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Bussklass</h4>
            </div>
            <div class="modal-body">
                <p>En indelning av bussar utifrån hur de är konstruerade
 och hur de används, om de exempelvis ska köras som stadsbuss, långväga 
busstrafik eller turistbuss.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div> 

<!-- Modal for identifieringsnummer -->
<div class="modal fade" tabindex="-1" id="ts-identifiering" role="dialog" aria-hidden="true" aria-labelledby="ts-identifiering">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Identifieringsnummer</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets chassinummer.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-senansteUtfRegbevis" role="dialog" aria-hidden="true" aria-labelledby="ts-senansteUtfRegbevis">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Senaste utfärdade registreringsbevis</h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning" role="alert">
                    <!-- Information om Senaste utfärdade registreringsbevis  -->
                    <div class="media">
                        <span class="glyphicon glyphicon-exclamation-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">
                            <p>Visar när det senaste registreringsbeviset har utfärdats. Registreringsbevis utfärdade före detta datum är ogiltiga.</p>                           
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-typ" role="dialog" aria-hidden="true" aria-labelledby="ts-typ">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Typ</h4>
            </div>
            <div class="modal-body">
                <div class="alert alert-info" role="alert">
                    <!-- Information om Senaste utfärdade registreringsbevis  -->
                    <div class="media">
                        <span class="glyphicon glyphicon-info-sign pull-left ts-info-sign bigger"></span>
                        <div class="media-body">
                            <p>
                                Uppgiften finns endast för typgodkända 
fordon och är en beteckning som ges av fordonstillverkaren. En typ är en
 grupp av fordon med vissa gemensamma egenskaper, som i sin tur består 
av minst en variant och version som ytterligare beskriver konstruktionen
 för fordonet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-iTrafikForstIUtl" role="dialog" aria-hidden="true" aria-labelledby="ts-iTrafikForstIUtl">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">I trafik första gången (vanligen i utlandet)</h4>
            </div>
            <div class="modal-body">
                <p>Visar vilket datum fordonet ställdes på första 
gången, i de fall fordonet har haft en tidigare registrering. Fordonet 
kan exempelvis ha varit registrerat i ett annat land eller tidigare 
varit registrerat i Sverige med annat registreringsnummer.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for import/införsel -->
<div class="modal fade" tabindex="-1" id="ts-import" role="dialog" aria-hidden="true" aria-labelledby="ts-import">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Import/införsel</h4>
            </div>
            <div class="modal-body">
                <p>
                    ”Ja” visas när fordonet är intaget till Sverige av
                    </p><ul>
                        <li> en privatperson, oavsett om fordonet är nytt eller har varit i trafik tidigare, eller</li>
                        <li> ett företag som inte är en yrkesmässig importör, oavsett om fordonet är nytt eller har varit i trafik tidigare, eller</li>
                        <li>ett företag som är en yrkesmässig importör och fordonet har varit i trafik tidigare.</li>
                    </ul>
                    ”Nej” visas när fordonet har ett annat ursprung än de fall som nämns ovan, till exempel
                    <ul>
                        <li>för ett fordon som är tillverkat i Sverige, eller </li>
                        <li>intaget till Sverige av ett företag som är en yrkesmässig importör och fordonet är nytt.</li>
                    </ul>
                <p></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-utredning" role="dialog" aria-hidden="true" aria-labelledby="ts-utredning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Utredning</h4>
            </div>
            <div class="modal-body">
                <p>”Ja" anges om utredning pågår. Exempelvis kan 
utredningen gälla den registrerade ägaruppgiften och då kan inte ett 
ägarbyte registreras så länge utredningen pågår.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-tillfRegistrering" role="dialog" aria-hidden="true" aria-labelledby="ts-tillfRegistrering">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Tillfällig registrering</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Visar om fordonet har en tillfällig 
registrering. En sådan registrering gäller under kortare tid och kan 
främst användas vid import eller export av fordon. <a target="_blank" title="Tillfällig registrering" href="https://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Export-och-tillfallig-registrering/Tillfallig-registrering/">Läs mer om tillfällig registrering. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal fade" tabindex="-1" id="ts-YrkesmassigTrafik" role="dialog" aria-hidden="true" aria-labelledby="ts-YrkesmassigTrafik">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Yrkesmässig trafik</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Om fordonet är registrerat för yrkesmässig 
trafik anges användningssätt Godstrafik, Taxitrafik, Busstrafik, 
Linjetrafik, Uthyrning.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- Modal for förvärvsdatum -->
<div class="modal fade" id="ts-korforbud" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-korforbud">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Körförbud</h4>
            </div>
            <div class="modal-body">
                <p>Visar vilket datum fordonet fick körförbud, till exempel på grund av utebliven kontrollbesiktning.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- Modal for förvärvsdatum -->
<div class="modal fade" id="ts-matarstallning" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-matarstallning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Mätarställning</h4>
            </div>
            <div class="modal-body">
                <p>Visar rapporterad mätarställning vid den senaste 
besiktningen där uppgiften har lästs av. Visar inte vilken enhet 
mätarställningen är rapporterad i, exempelvis om det är km eller miles.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- Modal for förvärvsdatum -->
<div class="modal fade" id="ts-forfallodatumForelaggande" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-forfallodatumForelaggande">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Föreläggande</h4>
            </div>
            <div class="modal-body">
                <p>Datum då fordonet fick ett föreläggande. Fordonet kan
 ha föreläggande i form av kontrollbesiktning, registreringsbesiktning, 
begränsad registreringsbesiktning eller intyg.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- Modal for förvärvsdatum -->
<div class="modal fade" id="ts-forelaggande" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-forelaggande">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Föreläggande</h4>
            </div>
            <div class="modal-body">
                <div class="media-body">
                    <p>Visar vilket till och med datum fordonet har ett 
föreläggande. Fordonet kan ha föreläggande i form av kontrollbesiktning,
 registreringsbesiktning, begränsad registreringsbesiktning eller intyg.
 <a target="_blank" title="Föreläggande" href="http://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsbesiktning/">Läs mer om Besiktning. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-fordonsSkattsPlikt" role="dialog" aria-hidden="true" aria-labelledby="ts-fordonsSkattsPlikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsskattepliktigt</h4>
            </div>
            <div class="modal-body">
                <p>
                    Visar om fordonet i grunden är 
fordonsskattepliktigt. "Ja" kan visas i särskilda fall även om fordonet 
är befriat från fordonsskatt, till exempel för fordon som är 
skattebefriade på grund av sin miljöklass eller för diplomatfordon.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-arsSkatt" role="dialog" aria-hidden="true" aria-labelledby="ts-arsSkatt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Årsskatt</h4>
            </div>
            <div class="modal-body">
                <p>
                    Fordon som inte tagits i trafik (varit påställd) i 
Sverige har en preliminär uppgift avseende årsskatt. Denna uppgift kan 
ändras när fordonet tas i trafik.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-anvandningsforbud" role="dialog" aria-hidden="true" aria-labelledby="ts-anvandningsforbud">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Användningsförbud</h4>
            </div>
            <div class="modal-body">
                <p>Användningsförbud inträder om det finns skatter eller andra avgifter som inte har betalats i rätt tid.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-debiteringPastallning" role="dialog" aria-hidden="true" aria-labelledby="ts-debiteringPastallning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Debitering vid påställning kr</h4>
            </div>
            <div class="modal-body">
                <p>
                    Visar hur mycket fordonsskatt (och eventuellt andra 
avgifter) som debiteras om fordonet ställs på. Om fordonet ställs på i 
betalmånaden (månaden då ordinarie skatt ska betalas) debiteras även 
skatt för nästföljande period. För fordon med en årsskatt över 4800 kr 
förändras beloppet varje dygn.
                </p>               
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-aterbetalningAvstallning" role="dialog" aria-hidden="true" aria-labelledby="ts-aterbetalningAvstallning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">
                    Återbetalning vid avställning
                </h4>
            </div>
            <div class="modal-body">
                <p>Visar hur mycket fordonsskatt som återbetalas om 
fordonet ställs av. Detta gäller endast om tidigare fordonsskatt är 
betald. För fordon med en årsskatt över 4800 kr förändras beloppet varje
 dygn. Observera att belopp under 50 kr inte återbetalas.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-karosseri" role="dialog" aria-hidden="true" aria-labelledby="ts-karosseri">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Karosseri</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p><a target="_blank" title="karosseri för olika fordonsslag" href="https://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Koder-for-fordonsuppgifter/Karosserikoder">Läs mer om karosseri för olika fordonsslag. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal fade" tabindex="-1" id="ts-karosseriTillagg" role="dialog" aria-hidden="true" aria-labelledby="ts-karosseriTillagg">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Karosseri tillägg</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p><a target="_blank" title="Karosstillägg" href="https://transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Koder-for-fordonsuppgifter/Karosserikoder/Tillaggskoder-bilaga-II">Läs mer om karosseri tillägg. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>



<div class="modal fade" tabindex="-1" id="ts-tjanstevikt" role="dialog" aria-hidden="true" aria-labelledby="ts-tjanstevikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Tjänstevikt</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Fordonets faktiska vikt, vilket är vikten i 
körklart skick plus tilläggsutrustning som är monterad av tillverkaren. 
 Även föraren är inkluderad i denna vikt för de flesta fordonsslag. <a target="_blank" title="Fordonets faktiska vikt" href="https://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Vikter/">Läs mer om vad som ingår för varje fordonsslag. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a>
 För fordon som är registrerade innan år 2015 går det inte att säga om 
tilläggsutrustningen ingår i den vikt som anges eller inte eftersom 
tidigare regler har tillåtit fordonstillverkaren att ange en mer 
generell vikt om de har önskat det.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-totalvikt" role="dialog" aria-hidden="true" aria-labelledby="ts-totalvikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Totalvikt</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Totalvikten är tjänstevikten plus max lastvikt. Totalvikten får aldrig överskridas när fordonet används. <a target="_blank" title="Fordonets högsta vikt i bruk" href="https://www.transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsregler/Vikter/">Läs mer om vad som ingåri totalvikten för varje fordonsslag. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal fade" tabindex="-1" id="ts-ursprungligTotalvikt" role="dialog" aria-hidden="true" aria-labelledby="ts-ursprungligTotalvikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Ursprunglig totalvikt</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Totalvikten sänks om garanterad 
axel-/boggitryck överskrids vid beräkning av totalviktsfördelningen. 
Besiktningsföretaget anger då både den sänkta totalvikten och den 
ursprungliga totalvikten.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal fade" tabindex="-1" id="ts-tillatenLastvikt" role="dialog" aria-hidden="true" aria-labelledby="ts-tillatenLastvikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Tillåten lastvikt</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Vanligen tillåts ett fordon att lasta enligt 
den uppgift som ges i fältet Max lastvikt. För vissa fordon är dock 
bruttovikten (tjänstevikt + last vid tillfället) begränsad, ibland av 
tekniska skäl men oftast enligt de regler om viktbestämmelser som gäller
 för för att köra på vägar med bärighetsklass 1 (BK1-väg). I dessa fall 
gäller denna vikt istället som tillåten lastvikt för fordonet. <a target="_blank" title="Fordonets högsta vikt i bruk" href="http://www.transportstyrelsen.se/sv/vagtrafik/Yrkestrafik/Gods-och-buss/Matt-och-vikt/">Läs mer om mått och vikt. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-skatteviktLast" role="dialog" aria-hidden="true" aria-labelledby="ts-skatteviktLast">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Skattevikt låst</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Äldre fordon kan ha en skattevikt som är 
låst, dvs manuellt registrerad i Vägtrafikregistret. Ett 
besiktningsföretag beräknade fordonets lastviktsuppgifter och N-värde 
(lastens tyngdpunkt).</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-skatteviktKg" role="dialog" aria-hidden="true" aria-labelledby="ts-skatteviktKg">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Skattevikt</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>För de fordon som beskattas utifrån vikt 
används tjänstevikt eller totalvikt för fordonsbeskattning beroende av 
vilket fordonsslag fordonet har.<a target="_blank" title="Skattevikt" href="https://transportstyrelsen.se/sv/vagtrafik/Fordon/Fordonsskatt/Hur-bestams-skattens-storlek/"> Läs mer om hur fordonsskatten bestäms och beräknas. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-framreOverhang" role="dialog" aria-hidden="true" aria-labelledby="ts-framreOverhang">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Främre överhäng</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Anger hur stor del av fordonet som ligger framför den första axelns centrumpunkt.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-bakreOverhang" role="dialog" aria-hidden="true" aria-labelledby="ts-bakreOverhang">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Bakre överhäng</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Anger hur stor del av fordonet som ligger bakom den sista axelns centrumpunkt.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-bandbredd" role="dialog" aria-hidden="true" aria-labelledby="ts-bandbredd">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Bandbredd</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Bredden på drivband eller matta på ett fordon som inte har hjul.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-axelavstand" role="dialog" aria-hidden="true" aria-labelledby="ts-axelavstand">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Axelavstånd</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Avståndet mellan två axlar. Om fordonet har fler än två axlar anges de med ordningsföljd framifrån och bakåt.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-garanteratAxelBoggitryck" role="dialog" aria-hidden="true" aria-labelledby="ts-garanteratAxelBoggitryck">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Garanterat axel/boggitryck</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Max tillåten vikt på varje axel/axelgrupp</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-tekniskTillatenViktAxel" role="dialog" aria-hidden="true" aria-labelledby="ts-tekniskTillatenViktAxel">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Teknisk tillåten vikt/axel</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Max tillåten vikt på varje axel</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-tekniskTillatenViktAxelgrupp" role="dialog" aria-hidden="true" aria-labelledby="ts-tekniskTillatenViktAxelgrupp">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Teknisk tillåten vikt/axelgrupp</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Max tillåten vikt på varje axelgrupp</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-kopplingsanordning" role="dialog" aria-hidden="true" aria-labelledby="ts-kopplingsanordning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">               
                <h4 class="modal-title">Kopplingsanordning</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Fordonets draganordning.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-belastningPaKoppling" role="dialog" aria-hidden="true" aria-labelledby="ts-belastningPaKoppling">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Största belastning koppling</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Största statiska belastningen på en 
kopplingsanordning, t ex det tryck som en släpvagn genererar då 
kulhandsken vilar på en kula (ungefär 20 – 75 kg) vid stillastående</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- Modal for max sammanlagd bruttovikt -->
<div class="modal fade" tabindex="-1" id="ts-maxLastvikt" role="dialog" aria-hidden="true" aria-labelledby="ts-maxLastvikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max lastvikt</h4>
            </div>
            <div class="modal-body">
                <p>Maximal tillåten vikt som fordonet får lastas med, 
inklusive passagerare. Uppgiften tas fram genom att beräkna skillnaden 
mellan fordonets totalvikt och tjänstevikt.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- Modal for max släpvagnsvikt -->
<div class="modal fade" tabindex="-1" id="ts-maxViktslapvagn" role="dialog" aria-hidden="true" aria-labelledby="ts-maxViktslapvagn">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max släpvagnsvikt</h4>
            </div>
            <div class="modal-body">
                <p>Den högsta vikten i kg för ett släpfordon med 
bromsanordning som får kopplas till fordonet. Denna vikt avser släpets 
bruttovikt (tjänstevikt plus last vid tillfället).</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-maxViktSlapkarra" role="dialog" aria-hidden="true" aria-labelledby="ts-maxViktSlapkarra">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max vikt för släpkärra</h4>
            </div>
            <div class="modal-body">
                <p>Den högsta vikten i kg för ett släpfordon med 
bromsanordning som får kopplas till fordonet. Denna vikt avser släpets 
bruttovikt (tjänstevikt plus last vid tillfället).</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-maxViktPahangvagn" role="dialog" aria-hidden="true" aria-labelledby="ts-maxViktPahangvagn">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max släpvikt, påhängsvagn</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Högsta vikt i kg för påhängsvagn</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-maxslapobroms" role="dialog" aria-hidden="true" aria-labelledby="ts-maxslapobroms">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max släpvikt obromsad</h4>
            </div>
            <div class="modal-body">                
                <p>Den högsta vikten i kg för ett släpfordon utan 
bromsanordning som får kopplas till fordonet. Denna vikt avser släpets 
bruttovikt (tjänstevikt plus last vid tillfället).</p>
                <div class="alert alert-warning" role="alert">
                    <div class="media">
                        <span class="glyphicon glyphicon-exclamation-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">                          
                            <p>Observera att olika hastigheter kan gälla beroende på viktförhållande mellan fordonet och släpet. <a target="_blank" title="Max släpvikt obromsad" href="https://www.transportstyrelsen.se/hastighet-slap">Läs mer om hur fort du får köra med släp. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>


<!-- Modal for max sammanlagd bruttovikt -->
<div class="modal fade" tabindex="-1" id="ts-maxSamBruttovikt" role="dialog" aria-hidden="true" aria-labelledby="ts-maxSamBruttovikt">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max sammanlagd bruttovikt (tågvikt)</h4>
            </div>
            <div class="modal-body">
                <p>Den högsta vikten i kg för fordonet tillsammans med 
ett tillkopplat släp. Här avses de båda fordonens gemensamma 
tjänstevikter plus last vid tillfället.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<div class="modal fade" tabindex="-1" id="ts-kopplingavstånd" role="dialog" aria-hidden="true" aria-labelledby="ts-kopplingavstånd">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Kopplingsavstånd</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <strong>
                        För Personbil, Lastbil och Buss:
                    </strong>
                    <ul>
                        <li>avståndet är från fordonets framkant till kopplingsanordningens centrum. </li>
                    </ul>
                    <strong>För Släp:</strong>
                    <ul>
                        <li>avståndet är från fordonets bakkant till kopplingsanordningens centrum.</li>
                    </ul>
                    <br>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-kopplingAvstNat" role="dialog" aria-hidden="true" aria-labelledby="ts-kopplingAvstNat">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Kopplingsavstånd, nationellt</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <p>
                        Kopplingsavståndet enligt äldre nationella regler.
                    </p>
                    <strong>För Personbil, Lastbil och Buss:</strong>
                    <ul>
                        <li>avståndet är från kopplingsanordningens centrum, till första axeln. </li>
                    </ul>
                    <strong>För Släp:</strong>
                    <ul>
                        <li>avståndet är från kopplingsanordningens centrum till första axeln.</li>
                    </ul>

                    <br>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-MaxKopplingavstånd" role="dialog" aria-hidden="true" aria-labelledby="ts-MaxKopplingavstånd">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Max Kopplingsavstånd</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <p>För fordon med variabel längd anges kopplingsavståndet med ett minimi- och maxvärde.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- /.modal -->
<!-- Modal for släpvikt max vid b-körkort -->
<div class="modal fade" tabindex="-1" id="ts-slapmaxvidb" role="dialog" aria-hidden="true" aria-labelledby="ts-slapmaxvidb">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Släpets högsta tillåtna totalvikt vid körkortsbehörighet B</h4>
            </div>
            <div class="modal-body">
                <p>Denna vikt är fastställd utifrån körkortsbehörighet 
B, där föraren får framföra en fordonskombination (totalvikter för 
fordon plus släp) på högst 3500 kg. Den uppgift som anges här är därför 
beräknad 3500 kg minus fordonets totalvikt.</p>
                <div class="alert alert-warning" role="alert">
                    <div class="media">
                        <span class="glyphicon glyphicon-exclamation-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">
                            <p>Förare med körkortsbehörighet B får 
alltså aldrig dra ett släp med en totalvikt som överstiger denna vikt. 
Observera att oavsett vilken vikt som står i detta fält får släpet 
aldrig lastas så att bruttovikten (tjänstevikt plus last vid färd) 
överstiger den vikt som anges i fältet för Max släpvagnsvikt eller Max 
släpvikt för kärra. Dessa vikter är de vikter som tillverkaren har 
angivit att fordonet klarar av att dra. <a target="_blank" title="Max släpvikt obromsad" href="https://www.transportstyrelsen.se/personbil-med-slap/">Läs mer om att dra släp med personbil. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->
<!-- Modal for for släpvikt max vid utökat b-körkort -->
<!-- /.modal -->
<!-- Modal for släpvikt max vid b-körkort utökad-->
<div class="modal fade" tabindex="-1" id="ts-slapmaxvidutokadb" role="dialog" aria-hidden="true" aria-labelledby="ts-slapmaxvidutokadb">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Släpets högsta tillåtna totalvikt vid utökad körkortsbehörighet B</h4>
            </div>
            <div class="modal-body">
                <p>Denna vikt är fastställd utifrån körkortsbehörighet 
med utökad B, där föraren får framföra en fordonskombination 
(totalvikter för fordon plus släp) på högst 4250 kg. Den uppgift som 
anges här är därför beräknad 4250 kg minus fordonets totalvikt.</p>
                <div class="alert alert-warning" role="alert">
                    <div class="media">
                        <span class="glyphicon glyphicon-exclamation-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">
                            <p>Förare med utökad körkortsbehörighet B 
får alltså aldrig dra ett släp med en totalvikt som överstiger denna 
vikt. Observera att oavsett vilken vikt som står i detta fält får släpet
 aldrig lastas så att bruttovikten (tjänstevikt plus last vid färd) 
överstiger den vikt som anges i fältet för Max släpvagnsvikt eller Max 
släpvikt för kärra. Dessa vikter är de vikter som tillverkaren har 
angivit att fordonet klarar av att dra. <a target="_blank" title="Max släpvikt obromsad" href="https://www.transportstyrelsen.se/personbil-med-slap/">Läs mer om att dra släp med personbil. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
<!-- /.modal -->
<!-- Modal for for släpvikt max vid utökat b-körkort --><div class="modal fade" tabindex="-1" id="ts-avanceratBromssystem" role="dialog" aria-hidden="true" aria-labelledby="ts-avanceratBromssystem">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Avancerat bromssystem</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Visar om fordonet har ABS, CBS eller ABS+CBS bromsar.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-antSatenStillastaende" role="dialog" aria-hidden="true" aria-labelledby="ts-antSatenStillastaende">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Antal säten stillastående, gäller husbilar</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <div class="media-body">
                        <p>Max antal säten som får användas endast när fordonet står stilla.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-drivmedKomb" role="dialog" aria-hidden="true" aria-labelledby="ts-drivmedKomb">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Drivmedelskombination</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <div class="media-body">
                        <ul>
                            <li>Bibränsle – två tankar, exempel bensin och metan.</li>
                            <li>Flexbränsle – två drivmedel som samsas i samma tank, exempel bensin och etanol.</li>
                            <li>Dubbelbränsle -  två drivmedel som 
lagras i var sin tank. Skillnaden mot två bränslen (bifuel) blir att man
 kör med bägge bränslen samtidigt, och mot flexfuel att bränslen inte 
behöver samsas i samma tank. Exempel diesel och metan.</li>
                            <li>Trebränsle – kombinationer av ovan.</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-elfordon" role="dialog" aria-hidden="true" aria-labelledby="ts-elfordon">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Elfordon</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Elfordon som drivs av enbart  el eller 
Elhybridfordon som inte är externt laddningsbart eller Elhybridfordon 
som är externt laddningsbart.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-slagvolym" role="dialog" aria-hidden="true" aria-labelledby="ts-slagvolym">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Slagvolym (cylindervolym)</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Motorns storlek, cylindervolym.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-effektnorm" role="dialog" aria-hidden="true" aria-labelledby="ts-effektnorm">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Effektnorm</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Anges i vilken norm effekten uppmäts. Följande normer kan förekomma: EG, DIN, ISO, SMMT, OECD, SAE, PEAK, BSAU och OKÄND</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-varvtalStillastaende" role="dialog" aria-hidden="true" aria-labelledby="ts-varvtalStillastaende">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Varvtal stillastående</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Med en decibelmätare (ljudmätare) mäts hur 
mycket buller ett fordon åstadkommer. Vid stillastående mäter man vid en
 punkt ca 0,5 meter och 45 grader snett bakom fordonet vid ett visst 
angivet motorvarvtal.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- Modal for typgodkännandenummer -->
<div class="modal fade" tabindex="-1" id="ts-godnummer" role="dialog" aria-hidden="true" aria-labelledby="ts-godnummer">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Typgodkännandenummer</h4>
            </div>
            <div class="modal-body">
                <p>Fordonstypens godkännandenummer som åsätts efter beslut hos myndighet.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-arbetsfordon" role="dialog" aria-hidden="true" aria-labelledby="ts-arbetsfordon">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Arbetsfordon</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Anger om fordonet anses vara ett 
arbetsfordon, dvs. ett tungt fordon som inte är avsett för leverans av 
varor, vid test av koldioxidutsläpp enligt EU-förordning 2017/2400/EU. 
För ett sådant fordon kan uppgift om specifikt CO2 saknas.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-specifiktCO2" role="dialog" aria-hidden="true" aria-labelledby="ts-specifiktCO2">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Specifikt CO<sub>2</sub></h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Beräknat värde för tunga fordon som omfattas av kraven att testa koldioxidutsläpp enligt EU-förordning 2017/2400/EU.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><div class="modal fade" tabindex="-1" id="ts-nyttolast" role="dialog" aria-hidden="true" aria-labelledby="ts-nyttolast">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Genomsnittlig nyttolast</h4>
            </div>
            <div class="modal-body">
                <!-- Information om karosseri -->
                <div class="media">
                    <div class="media-body">
                        <p>Den last som är representativ för det 
användningsområde som fordonet anses ha i samband med test av 
koldioxidutsläpp för tunga fordon enligt EU-förordning 2017/2400/EU.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div></form>
                        </div>
                    </div>
                    <div class="content-secondary col-md-4 col-sm-12 col-xs-12">
    <h2 id="ts-h2">Relaterade e-tjänster</h2>
    <ul class="list-group">
        <li class="list-group-item">
            <a target="_blank" href="https://transportstyrelsen.se/slapvagnskalkylator" title="Släpvagnskalkylator, öppnas i nytt fönster"><strong>Släpvagnskalkylator </strong><span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a>
            <span class="help-block small">Visar om fordonet får dra en specifik släpvagn eller husvagn.</span>
        </li>
    </ul>
    <ul class="list-group">
        <li class="list-group-item">
            <a href="https://www.transportstyrelsen.se/e-tjanster-inom-vagtrafik" target="_blank" title="Visar lista på alla e-tjänster för vägtrafik, öppnas i nytt fönster"><strong>Alla e-tjänster inom vägtrafik </strong><span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a>
            <span class="help-block small">Listar alla e-tjänster inom fordon, körkort och yrkestrafik.</span>
        </li>
    </ul>
</div>

                </div>

                <div class="content-secondary">

                </div>

                <div class="clearfix"></div>
            </div>
        </main>

        <footer id="footer" class="row">
    <div class="col-sm-3 col-md-3 col-md-offset-3 col-sm-offset-3"><a class="ts-navbar-bottom-link" href="https://www.transportstyrelsen.se/om-webbplatsen" target="_blank">Om webbplatsen</a></div>
    <div class="col-sm-3 col-md-3"><a class="ts-navbar-bottom-link" href="https://www.transportstyrelsen.se/sv/kontakta-oss" target="_blank">Kontakta oss</a></div>
</footer>

    </div>

    
<div class="modal fade" id="logoutmodal" role="dialog" aria-hidden="true" aria-labelledby="logoutmodal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button class="close" aria-hidden="true" type="button" data-dismiss="modal">×</button>
                <h2 class="modal-title ts-h2" id="myModalLabel1">Inloggad</h2>
            </div>
            <div class="modal-body">
                <p>Är du säker på att du vill logga ut ur e-tjänsten?</p>
            </div>
            <div class="modal-footer">
                
<form action="/Registerutdrag/LoggaUt" method="post">                    <button class="btn btn-default" type="button" id="logOutButton" data-dismiss="modal">Avbryt</button>
                    <input type="submit" value="Logga ut" class="btn btn-primary">
</form>            </div>
        </div>
    </div>
</div>
    


<div class="modal fade" id="modalForLeavingSite" role="dialog" aria-hidden="true" aria-labelledby="modalForLeavingSite" tabindex="-1">
    
    <div class="modal-dialog">
        
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title ts-h2">Du håller på att lämna e-tjänsten!</h2>
            </div>
            <div class="modal-body">
                <p>Är du säker på att du vill lämna tjänsten och gå till
 Transportstyrelsens startsida? Information som inte sparats försvinner 
om du lämnar tjänsten.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" type="button" data-dismiss="modal">Avbryt</button>
                <button type="submit" class="btn btn-primary" id="leaveSiteButton" onclick="location.href = 'https://www.transportstyrelsen.se'">Gå till Transportstyrelsens startsida</button>
            </div>
        </div>
    </div>
</div>

    <script src="Fordonsuppgifter_files/TSDesign.es"></script>

    <script src="Fordonsuppgifter_files/FordonsuppgifterScripts.es"></script>

    <script src="Fordonsuppgifter_files/BrowserCompatibility.es"></script>­<style>@font-face {font-family:"font";src:url("https://")}@media (touch-enabled),(-webkit-touch-enabled),(-moz-touch-enabled),(-o-touch-enabled),(-ms-touch-enabled),(modernizr){#touch{top:9px;position:absolute}}@media (transform-3d),(-webkit-transform-3d),(-moz-transform-3d),(-o-transform-3d),(-ms-transform-3d),(modernizr){#csstransforms3d{left:9px;position:absolute;height:3px;}}#generatedcontent:after{content:":)";visibility:hidden}</style>

    


</body></html>`

const tag = `<!DOCTYPE html>
<html lang="sv-se" class=" js no-flexbox flexbox-legacy canvas canvastext webgl no-touch geolocation postmessage no-websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients no-cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio no-localstorage no-sessionstorage webworkers no-applicationcache svg inlinesvg smil svgclippaths lopqixa idc0_350" data-lt-installed="true"><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="x-ua-compatible" content="IE=EDGE">
    <title>Fordonsuppgifter</title>
    <link href="https://fordon-fu-regnr.transportstyrelsen.se/favicon.ico" rel="shortcut icon" type="image/x-icon">

    <link href="Fordonsuppgiftertag_files/TSDesign.css" rel="stylesheet">

    <link href="Fordonsuppgiftertag_files/Fonts.css" rel="stylesheet">

    <link href="Fordonsuppgiftertag_files/FordonsuppgifterCss.css" rel="stylesheet">

<style type="text/css"></style></head>
<body style="">
    <div id="page" class="container" data-timeout-url="/UppgifterAnnatFordon/Timeout" data-logout-url="/UppgifterAnnatFordon/LoggaUtSpecial">

        <header>
    <div id="header" class="row">
        <div id="transport-container" class="col-sm-9 col-xs-12">
            <!-- Vitt block (logga + trafikslagsknappar) -->
            <div class="row">
                <div id="logotype" class="col-sm-4 col-xs-12">
                    <a href="#" data-target="#modalForLeavingSite" data-toggle="modal" data-keyboard="true">
                        <img src="Fordonsuppgiftertag_files/logo_sv.png" alt="Transportstyrelsen" class="ts-header-logo">
                    </a>
                </div>
                <!-- /nav-transport -->
            </div>
            <!-- /transport-container -->
        </div>
    </div>
</header>


        <div id="mainHeader" class="row">
            <div id="logginmenucontent">
                
            </div>
        </div>
        <main id="main" class="row">
            <div id="content" class="col-sm-10 col-sm-offset-1 col-md-9 col-md-offset-3">
                <div class="row">
                    <div id="content-primary" class="col-md-8 ts-full-height-container">
                        <div>
                            




<form action="/" method="post"><input name="__RequestVerificationToken" type="hidden" value="he9ZE0yzJkSX9QdIIxvB2-2rMmJ5gVl-NnM6FJ01FjtjDpDBBhzmRJA0Kg_cU1M6o3PF8TN90O68VPQfFyAWca4TSkIiiNEh7W4XiTJR4Tc1">    <h1 class="ts-h1">Fordonsuppgifter för TAG06Z</h1>
    <div class="panel-group" id="accordion">

        <!--Ta bort detta sedan-->
        


        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-sammanfattning-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-sammanfattningCollapse">
            <a href="#ts-sammanfattning-heading" data-parent="#accordion">
                Sammanfattning<span class="glyphicon glyphicon-chevron-up ts-chevron pull-right"></span>
            </a>
        </span>
    </div>
    <div id="ts-sammanfattningCollapse" class="panel-collapse collapse in">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        (2*)<strong>Registreringsnummer</strong>
                        <br>
                        TAG06Z

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFabrikatOchTyp" data-toggle="modal">
                                Fabrikat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        TOYOTA

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samHandelsbeteckning" data-toggle="modal">
                                Handelsbeteckning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        TOYOTA COROLLA

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-fordonsstatus" data-keyboard="true" data-toggle="modal">
                                Fordonsstatus <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Påställt (2021-06-24)

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Färg</strong>
                        <br>
                        Mörkblå

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonsar" data-toggle="modal">
                                Fordonsår <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
2021
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonTillverkat" data-toggle="modal">
                                Fordonet tillverkat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2021-05-26

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Fordonsslag</strong>
                        <br>
                        Personbil

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                        <p>
                            (8*)<strong>Besiktigas senast</strong>
                            <br>
                            2026-04-30

                        </p>
                </div>
                                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-samanvandningsforbud" data-toggle="modal">
                                    Användningsförbud <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Nej
                    </p>
                </div>
                                <div class="col-sm-12 col-xs-12">
                    <p>
                        *numrering enligt harmoniserade unionskoder i 2014/45/EU bilaga II
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="fullstandiga-uppgifter">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-fullstandigaCollapse">
            <a href="#fullstandiga-uppgifter">Uppgifter som inte får visas i tjänsten <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span><span title="Vi får inte visa vissa uppgifter i tjänsten. För att ta del av uppgifterna kan du ange din mejladress." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span></a>
        </span>
    </div>
    <div id="ts-fullstandigaCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="alert alert-info ts-full-info" role="alert">
                <!-- Info om privat ägare -->
                <div class="media">
                    <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger hidden-xs hidden-sm"></span>
                    <div class="media-body">
                        <p>Fordonet ägs av en privatperson. Enligt 
dataskyddsförordningen (GDPR) får vi inte visa namn på ägare och 
tidigare ägare i tjänsten. </p>
                        <p><a href="https://fordon-fu-regnr.transportstyrelsen.se/UppgifterAnnatFordon/Registerutdrag/638596592342020831" target="_self">Du kan beställa ett mejl med fordons- och ägaruppgifter.</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default ts-panel">
    <div class="panel-heading" id="agare">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-agareCollapse">
            <a href="#agare">Ägare/brukare
                <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> <span title="Fordonet ägs av en privatperson." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
            </a>
        </span>
    </div>
    <div id="ts-agareCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="alert alert-info ts-agar-info" role="alert">
                <!-- Info om privat ägare -->
                <div class="media">
                    <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger hidden-xs hidden-sm"></span>
                    <div class="media-body">
                        <p>Fordonet ägs av en privatperson och därför visas inte namn på nuvarande eller tidigare ägare i tjänsten. <a href="https://fordon-fu-regnr.transportstyrelsen.se/UppgifterAnnatFordon/Registerutdrag/638596592342020831" target="_self">Du kan beställa ett mejl med fordons- och ägaruppgifter</a>. Du kan också få reda på vem som är ägare via <a target="_blank" title="Läs mer om vår sms-tjänst Vem äger fordonet" href="https://www.transportstyrelsen.se/sms-agare">sms-tjänsten Vem äger fordonet? <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
                    </div>
                </div>
            </div>
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Förvärvsdatum</strong><br>
                        2021-06-24

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-brukare" data-toggle="modal">
                                Antal brukare <span id="ts-info-sign" title="Du kan ta reda på senaste två ägarna."></span><span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong><br>
                        1

                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-producent" data-toggle="modal">
                                    Producentansvarig <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            556041001
                        </p>
                    </div>
            </div>
        </div>
    </div>
</div>
        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-fordonsidentitet-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-fordonsidentitetCollapse">
            <a href="#ts-fordonsidentitet-heading">Fordonsidentitet<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> </a>
        </span>
    </div>
    <div id="ts-fordonsidentitetCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Registreringsnummer</strong>
                        <br>
TAG06Z                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFabrikatOchTyp" data-toggle="modal">
                                Fabrikat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        TOYOTA

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samHandelsbeteckning" data-toggle="modal">
                                Handelsbeteckning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        TOYOTA COROLLA

                    </p>
                </div>

                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Färg</strong>
                        <br>
                        Mörkblå

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Fordonsslag</strong><br>
                        Personbil

                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Fordonsslagsklass</strong><br>
                            Personbil
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-fordonskategori" data-toggle="modal">
                                    Fordonskategori <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            M1
                        </p>
                    </div>

                                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonsar" data-toggle="modal">
                                Fordonsår <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2021

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-samFordonTillverkat" data-toggle="modal">
                                Fordonet tillverkat <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        2021-05-26

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-identifiering" data-toggle="modal">
                                Identifieringsnummer <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        SB1Z93BE30E227116

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        
                        <strong>Typgodkännandenummer</strong><br>
                        E6*2007/46*0318*04

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Typgodkännandedatum</strong>
                        <br>
                        2020-08-24

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-typ" data-toggle="modal">
                                Typ <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                    ZE1HE(EU,M)

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>Variant</strong>
                    <br>
                    ZWE211(W)

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>Version</strong>
                    <br>
                    ZWE211L-DWXNBW(3E)

                </p>
            </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Skyltformat, fram</strong><br>
                        Enradig
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Skyltformat, bak</strong><br>
                        Enradig
                    </p>
                </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>
                        <a class="ts-forklaring" href="#ts-senansteUtfRegbevis" data-keyboard="true" data-toggle="modal">
                            Senaste utfärdade registreringsbevis del 1 <span class=" ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                        </a>
                    </strong>
                    <br>
                    2021-06-24

                </p>
            </div>
            <div class="col-sm-6 col-xs-12">
                <p>
                    <strong>
                        <a class="ts-forklaring" href="#ts-senansteUtfRegbevis" data-keyboard="true" data-toggle="modal">
                            Senaste utfärdade registreringsbevis del 2 <span class=" ts-warning-sign glyphicon glyphicon-exclamation-sign ">
                            </span>
                        </a>
                    </strong>
                    <br>
                    2021-06-24

                </p>
            </div>
        </div>
    </div>
</div>
</div>

        <div class="panel panel-default ts-panel">
    <div class="panel-heading" id="status">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-statusCollapse">
            <a href="#status">Status<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-statusCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" data-keyboard="true" href="#ts-fordonsstatus" data-toggle="modal">
                                Fordonsstatus <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Påställt (2021-06-24)


                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Påställt första gången i Sverige</strong><br>
                        2021-06-24

                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>

                            <a class="ts-forklaring" data-keyboard="true" href="#ts-import" data-toggle="modal">
                                Import/införsel <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        Nej

                    </p>
                </div>
                                            </div>
        </div>
    </div>
</div>


        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-besiktning-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-besiktningCollapse">
            <a href="#ts-besiktning-heading">Besiktning<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-besiktningCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>Besiktigas senast</strong>
                            <br>
2026-04-30
                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Senast godkända besiktning</strong>
                            <br>
                            2024-04-05
                        </p>
                    </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-matarstallning" data-toggle="modal">
                                Mätarställning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        26973

                    </p>
                </div>


                </div>
        </div>
    </div>
</div>

        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-skatt-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-skattCollapse">
            <a href="#ts-skatt-heading">Skatt och avgifter<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-skattCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-fordonsSkattsPlikt" data-toggle="modal">
                                    Fordonsskattepliktigt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Ja
                    </p>
                </div>

                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-arsSkatt" data-toggle="modal">
                                    Årsskatt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                                
                            </strong>
                            <br>
                            1612 kronor
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Vägtrafikregisteravgift</strong>
                            <br>
                            62  kronor
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Betalningsmånad/er</strong>
                            <br>
                            November
                        </p>
                    </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-anvandningsforbud" data-toggle="modal">
                                    Användningsförbud <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            Nej
                    </p>
                </div>
                                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-aterbetalningAvstallning" data-toggle="modal">
                                    Återbetalning vid avställning <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            101 kronor
                        </p>
                    </div>
                                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Trängselskattepliktigt</strong>
                        <br>
                        Ja
                    </p>
                </div>

            </div>
        </div>
    </div>
</div>
        <div class="panel panel-default ts-panel">
    <div class="panel-heading ts-first-accordion" id="ts-teknik-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-tekniskCollapse">
            <a href="#ts-teknik-heading">Tekniska data<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-tekniskCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="panel-group" id="accordion2">
<div class="panel panel-default">
    <div class="panel-heading" id="ts-kaross-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-karossCollapse">
            <a href="#ts-kaross-heading">Kaross<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-karossCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-karosseri" data-toggle="modal">
                                Kaross <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        AC (Stationsvagn Kombivagn)

                    </p>
                </div>
                                            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-MattVikt-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-MattViktCollapse">
            <a href="#ts-MattVikt-heading">Mått och vikt<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    
    <div id="ts-MattViktCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Längd</strong>
                        <br>
                        4650 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Bredd</strong>
                        <br>
                        1790 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Höjd</strong>
                        <br>
                        1460 mm
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-tjanstevikt" data-toggle="modal">
                                Tjänstevikt (faktisk vikt) <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        1496 kg
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-maxLastvikt" data-toggle="modal">
                                Max lastvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        339 kg
                    </p>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>
                            <a class="ts-forklaring" href="#ts-totalvikt" data-toggle="modal">
                                Totalvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                            </a>
                        </strong>
                        <br>
                        1835 kg
                    </p>
                </div>
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-ursprungligTotalvikt" data-toggle="modal">
                                    Ursprunglig totalvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            1835 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-skatteviktKg" data-toggle="modal">
                                    Skattevikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            1490 kg
                        </p>
                    </div>
                                


            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-hjul-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-HjulOchAxlarCollapse">
            <a href="#ts-hjul-heading">Axlar och hjul <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-HjulOchAxlarCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Antal axlar</strong>
                            <br>
                            2
                        </p>
                    </div>
                                                                                            </div>
<hr>
<h2 class="ts-h2">Axel - 1</h2>
<div class="row ts-row-align">
        <div class="col-sm-6 col-xs-12">
            <p>
                <strong>
                    <a class="ts-forklaring" href="#ts-axelavstand" data-toggle="modal">
                        Max axelavstånd axel 1-2 <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                    </a>
                </strong>
                <br>
                2700 mm
            </p>
        </div>

            <div class="col-sm-6 col-xs-12">
            <p>
                <strong>Spårvidd</strong>
                <br>
                1530 mm
            </p>
        </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Däckdimension</strong>
            <br>
225/45R17        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Fälgdimension</strong>
            <br>
17X7 1/2J ET40 mm
        </p>
    </div>
            </div>
<hr>
<h2 class="ts-h2">Axel - 2</h2>
<div class="row ts-row-align">

            <div class="col-sm-6 col-xs-12">
            <p>
                <strong>Spårvidd</strong>
                <br>
                1530 mm
            </p>
        </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Däckdimension</strong>
            <br>
225/45R17        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Fälgdimension</strong>
            <br>
17X7 1/2J ET40 mm
        </p>
    </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default ts-panel">
    <div class="panel-heading" id="koppling">
        <span id="ts-h4-sub" class="panel-title" data-toggle="collapse" data-target="#ts-koppling-innerCollapse">
            <a href="#koppling">Kopplingsanordning och bromsar<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span> <span title="Använd släpvagnskalkylatorn för att se om fordonet får dra ett specifikt släp." class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span></a>
        </span>
    </div>
    <div id="ts-koppling-innerCollapse" class="panel-collapse collapse">
        <div class="panel-body">
                <div class="alert alert-info" role="alert">
                    <!-- Info om släp -->
                    <div class="media" id="ts-slapvagnskalkylatorn-info">
                        <span class="glyphicon glyphicon-info-sign pull-left ts-glyphicon-alerts bigger"></span>
                        <div class="media-body">
                            <p>Använd <a target="_blank" href="http://www.transportstyrelsen.se/slapvagnskalkylator">släpvagnskalkylatorn <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a> för att ta reda på om du får dra en specifik släpvagn eller husvagn med fordonet.</p>
                        </div>
                    </div>
                </div>
            <div class="row">
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Största belastning koppling fordon</strong>
                            <br>
                            75 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxViktslapvagn" data-toggle="modal">
                                    Max släpvagnsvikt <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            750 kg
                        </p>
                    </div>
                                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxslapobroms" data-toggle="modal">
                                    Max släpvikt, obromsad <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                                </a>
                            </strong>
                            <br>
                            450 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-maxSamBruttovikt" data-toggle="modal">
                                    Max sammanlagd bruttovikt (tågvikt) <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            2585 kg
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-slapmaxvidb" data-toggle="modal">
                                    Släpets högsta tillåtna totalvikt vid körkortsbehörighet B <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign"></span>
                                </a>
                            </strong> <br>
                            1665 kg
                        </p>

                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" data-keyboard="true" href="#ts-slapmaxvidutokadb" data-toggle="modal">
                                    Släpets högsta tillåtna totalvikt vid utökad körkortsbehörighet B <span class="ts-warning-sign glyphicon glyphicon-exclamation-sign "></span>
                                </a>
                            </strong>
                            <br>
                            2415 kg
                        </p>

                    </div>
                                                
                                                                                                <!-- Om vi bara har en träff i kopplingslistan så skapar vi ingen extra panel, det gör vi bara om vi har fler än en -->

            </div>
        </div>
    </div>
</div>
<div class="panel panel-default">
    <div class="panel-heading" id="ts-PassagerareSakerhet-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-PassagerareSakerhetCollapse">
            <a href="#ts-PassagerareSakerhet-heading">Passagerare<span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-PassagerareSakerhetCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Antal passagerare, max</strong><br>  
                        4

                    </p>
                </div>
                                                                        
                                                                        
    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Krockkudde, främre passagerarplats</strong>
                            <br>
                            JA
                        </p>
                    </div>
            </div>
        </div>
    </div>
</div><div class="panel panel-default">
    <div class="panel-heading" id="ts-miljo-heading">
        <span class="panel-title" data-toggle="collapse" data-target="#ts-miljoCollapse">
            <a href="#ts-miljo-heading">Motor och miljö <span class="glyphicon glyphicon-chevron-down ts-chevron pull-right"></span></a>
        </span>
    </div>
    <div id="ts-miljoCollapse" class="panel-collapse collapse">
        <div class="panel-body">
            <div class="row ts-row-align">
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Växellåda</strong>
                            <br>
                            VARIOMATIC

                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-slagvolym" data-toggle="modal">
                                    Slagvolym <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
1798                                cm<sup>3</sup>
                        </p>
                    </div>
                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Euroklassning</strong>
                            <br>
                            6
                        </p>
                    </div>
                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Utsläppsklass</strong>
                            <br>
                            ELHYBRID
                        </p>
                    </div>
                                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>
                                <a class="ts-forklaring" href="#ts-elfordon" data-toggle="modal">
                                    Elfordon <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                                </a>
                            </strong>
                            <br>
                            ELHYBRID
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Effekt, max (för elmotor)</strong>
                            <br>
                            53 kW
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Effekt under 30 minuter (för elmotor)</strong>
                            <br>
                            37 kW
                        </p>
                    </div>
                                    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Drivmedel</strong>
            <br>
            Bensin
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Motoreffekt</strong>
            <br>
            72 kW
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>
                <a class="ts-forklaring" href="#ts-effektnorm" data-toggle="modal">
                    Effektnorm <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                </a>
            </strong>
            <br>
            EG
        </p>
    </div>
<div class="col-sm-6 col-xs-12">
    <p>
        <strong>Max hastighet</strong>
        <br>
        180 km/h
    </p>
</div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Ljudnivå stillastående</strong>
            <br>
            71 dB
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>
                <a class="ts-forklaring" href="#ts-varvtalStillastaende" data-toggle="modal">
                    Varvtal stillastående <span class="ts-info-sign-privat glyphicon glyphicon-info-sign"></span>
                </a>
            </strong>
            <br>
            2500 min<sup>-1</sup>
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Ljudnivå vid körning</strong>
            <br>
            67 dB
        </p>
    </div>
    <div class="col-sm-6 col-xs-12">
        <p>
            <strong>Avgasdirektiv/reglemente</strong>
            <br>
            715/2007*2018/1832AP
        </p>
    </div>





                            </div>



    <hr>
    <h2 class="ts-h2"><strong>Koldioxidutsläpp, CO<sub>2</sub></strong></h2>
        <h3 class="ts-h3">Testcykel NEDC</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Landsvägskörning</strong>
                        <br>
                        91 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Stadskörning</strong>
                        <br>
                        80 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad körning</strong>
                        <br>
                        85 g/km
                    </p>
                </div>
                    </div>
        <h3 class="ts-h3">Testcykel WLTP</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Låg</strong>
                        <br>
                        99 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Medium</strong>
                        <br>
                        91 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Hög</strong>
                        <br>
                        101 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Extra hög</strong>
                        <br>
                        142 g/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad</strong>
                        <br>
                        113 g/km
                    </p>
                </div>
                    </div>
    <hr>
    <h2 class="ts-h2"><strong>Bränsleförbrukning</strong></h2>
        <h3 class="ts-h3">Testcykel NEDC</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Landsvägskörning</strong>
                        <br>
                        4 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Stadskörning</strong>
                        <br>
                        3,5 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad körning</strong>
                        <br>
                        3,8 l/100km
                    </p>
                </div>
                    </div>
        <h3 class="ts-h3">Testcykel WLTP</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Låg</strong>
                        <br>
                        4,4 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Medium</strong>
                        <br>
                        4 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Hög</strong>
                        <br>
                        4,5 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Extra hög</strong>
                        <br>
                        6,3 l/100km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Blandad</strong>
                        <br>
                        5 l/100km
                    </p>
                </div>
                    </div>

    <hr>
    <h2 class="ts-h2"><strong>Avgasutsläpp</strong></h2>
        <h3 class="ts-h3">Provningsförfarande: Typ1, testcykel WLTP</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Kolmonoxid, CO</strong>
                        <br>
                        101,2 mg/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Totala kolväten, THC</strong>
                        <br>
                        14,8 mg/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Ickemetankolväten, NMHC</strong>
                        <br>
                        13,4 mg/km
                    </p>
                </div>
                            <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Kväveoxider, NOx</strong>
                        <br>
                        2,3 mg/km
                    </p>
                </div>
                        
        </div>
        <h3 class="ts-h3">RDE (real drive emission)</h3>
        <h3 class="ts-h3">Fullständigt test</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Kväveoxider NOx</strong>
                        <br>
                        60
                    </p>
                </div>
                    </div>
            <h3 class="ts-h3">Test vid stadskörning</h3>
            <div class="row ts-row-align">
                    <div class="col-sm-6 col-xs-12">
                        <p>
                            <strong>Kväveoxider NOx</strong>
                            <br>
                            60
                        </p>
                    </div>
                            </div>
        <h3 class="ts-h3">Miljöinnovationer</h3>
        <div class="row ts-row-align">
                <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Miljöinnovation kod</strong>
                        <br>
                        E6 28
                    </p>
                </div>
                                        <div class="col-sm-6 col-xs-12">
                    <p>
                        <strong>Minskning av CO2 (testcykel WLTP)</strong>
                        <br>
                        0,7 g/km
                    </p>
                </div>
        </div>
            

        </div>
    </div>
</div>
            </div>
        </div>
    </div>
</div>

    </div>
    <input type="submit" value="Ny sökning" class=" btn btn-default">
    <input type="button" value="Dölj alla uppgifter" title="Fäll in alla kategorier. Bra om du vill dölja all information på sidan." id="minimize_button" class="btn btn-default pull-right">
    <input type="button" value="Visa alla uppgifter" title="Fäll ut alla kategorier. Bra om du vill skriva ut all information på sidan." id="expand_button" class="btn btn-default pull-right">
<div class="modal fade" tabindex="-1" id="ts-fordonsstatus" role="dialog" aria-hidden="true" aria-labelledby="ts-fordonsstatus">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsstatus</h4>
            </div>
            <div class="modal-body">
                <p>Visar om fordonet är påställt, avställt eller avregistrerat.</p>
                <div class="alert alert-info" role="alert">
                    <div class="media">
                        <span class="glyphicon glyphicon-info-sign pull-left ts-info-sign bigger"></span>
                        <div class="media-body">
                            <h4>Av- och påställning under kvällar och helger</h4>
                            <p>
                                Varje vardag klockan 19.30 och några 
timmar framåt sker en så kallad kvällsbearbetning och alla av- och 
påställningar som anmäls under den tiden läggs i en kö för att föras in i
 registret nästa vardagkväll. En sådan anmälan gäller från och med det 
datum anmälan sker, men det syns inte direkt i våra e-tjänster. (Om en 
anmälan sker under fredagens bearbetning kommer den inte att registreras
 förrän på måndag kväll.)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
    </div>
    <!-- /.modal-content -->
</div>
<!-- /.modal-dialog -->
<div class="modal fade" tabindex="-1" id="ts-samFabrikat" role="dialog" aria-hidden="true" aria-labelledby="ts-samFabrikat">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fabrikat</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets märke. Denna uppgift kan ibland även 
innehålla information om typ eller handelsbeteckning – se förklaring vid
 respektive fält.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFabrikatOchTyp" role="dialog" aria-hidden="true" aria-labelledby="ts-samFabrikatOchTyp">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fabrikat</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets märke. Denna uppgift kan ibland även 
innehålla information om typ eller handelsbeteckning – se förklaring vid
 respektive fält.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samHandelsbeteckning" role="dialog" aria-hidden="true" aria-labelledby="ts-samHandelsbeteckning">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Handelsbeteckning</h4>
            </div>
            <div class="modal-body">
                <p>Fordonets modell eller benämning (”populärnamn”). Saknas uppgift om handelsbeteckning kan den istället finnas i fältet fabrikat.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonsar" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonsar">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsår</h4>
            </div>
            <div class="modal-body">
                Uppgiften fastställs av Transportstyrelsen utifrån följande ordningsföljd:
                <ol>
                    <li>Fordonets årsmodell. Om årsmodell saknas är det istället</li>
                    <li>fordonets tillverkningsår. Saknas även tillverkningsår är det</li>
                    <li>det år då fordonet ställdes på första gången.</li>
                </ol>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonTillverkat" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonTillverkat">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonet tillverkat</h4>
            </div>
            <div class="modal-body">
                <p>Uppgiften kommer från tillverkaren och den kan bestå 
av ett fullständigt datum eller endast år och månad. Om 
Transportstyrelsen inte har fått in uppgiften från tillverkaren visas 
”Uppgift saknas”.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samAgarBundDisp" role="dialog" aria-hidden="true" aria-labelledby="ts-samAgarBundDisp">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Ägarbunden dispens</h4>
            </div>
            <div class="modal-body">
                <p>Undantag från regler som fordonet har genom särskilt 
beslut, och som endast gäller för nuvarande ägare. Om fordonet övergår 
till ny ägare upphör dispensen och fordonet måste eventuellt genomgå en 
registreringsbesiktning.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samFordonsRelSkulder" role="dialog" aria-hidden="true" aria-labelledby="ts-samFordonsRelSkulder">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonsrelaterade skulder</h4>
            </div>
            <div class="modal-body">
                <p>Kronofogden kan ta ett fordon i anspråk om det finns 
obetald fordonsskatt, trängselskatt, felparkeringsavgift eller 
infrastrukturavgift.<br>
                    Om fordonet sålts av en myndighet enligt 6 a § lag 
(1982:129) om flyttning av fordon i vissa fall, eller exekutivt av 
Kronofogden kan det dock inte tas i anspråk av Kronofogden för skulder 
uppkomna före eller samma datum som anges för undantaget.<br> 
                    Då visas följande text:<br>
                    UNDANTAG I ANSPRÅK ÅÅÅÅ-MM-DD
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-samanvandningsforbud" role="dialog" aria-hidden="true" aria-labelledby="ts-samanvandningsforbud">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Användningsförbud</h4>
            </div>
            <div class="modal-body">
                <p>Visar om fordonet har ett användningsförbud. 
Användningsförbud innebär att fordonet inte får användas på grund av 
obetalda skatter eller avgifter.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<div class="modal fade" tabindex="-1" id="ts-brukare" role="dialog" aria-hidden="true" aria-labelledby="ts-brukare">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Antal brukare</h4>
            </div>
            <div class="modal-body">
                <p>Antal brukare som varit registrerade som ägare till 
fordonet sedan det ställdes på för första gången. Brukare är oftast 
likställt med ägare till fordonet, men om fordonet är ett leasingfordon 
är leasinggivaren ägare till fordonet och brukaren den som leasar 
fordonet.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for Producentansvarig -->
<div class="modal fade" id="ts-producent" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-producent">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Producentansvarig</h4>
            </div>
            <div class="modal-body">
                <p>Producentansvaret är ett ekonomiskt ansvar för 
skrotning och återvinning av uttjänta fordon. Det innebär att 
producenten ska ansvara för att ett fordon skrotas på ett regelmässigt 
korrekt sätt. <a target="_blank" title="Läs mer om producentansvar och skrotning." href="https://transportstyrelsen.se/avregistrering-och-skrotning/">Läs mer om producentansvar och skrotning. <span class="ts-nytt-fonster-ikon glyphicon glyphicon-new-window"></span></a></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal">Stäng</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>

<!-- Modal for Fordonskategori -->
<div class="modal fade" id="ts-fordonskategori" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="ts-fordonskategori">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Fordonskategori</h4>
            </div>
            <div class="modal-body">
                <p>
                    En indelning av fordon utifrån fordonets ändamål och exempelvis vikt, antal sittplatser eller konstruktion.
                </p>
                <p>
                    <a target="_blank" title="Fordonskategorier" href="https://transportstyrelse`
// Call the function with the provided HTML content and log the results
const vehicleInfo = extractVehicleInfo(htmlContent)
console.log(vehicleInfo)
const vehicleInfo2 = extractVehicleInfo2(htmlContent)
console.log(vehicleInfo2)
const vehicleInfotag = extractVehicleInfo(tag)
console.log(vehicleInfotag)
const vehicleInfo2tag = extractVehicleInfo2(tag)
console.log(vehicleInfo2tag)
